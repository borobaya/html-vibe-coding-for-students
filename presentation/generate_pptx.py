"""Generate a PowerPoint version of the AI & the Future presentation."""

import os
import re
import tempfile
from io import BytesIO
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

# ── Paths ──────────────────────────────────────────────────────
HERE = Path(__file__).resolve().parent
ASSETS = HERE / "assets"
VIBE_ASSETS = HERE.parent / "vibe-coding-intro" / "assets"

# Temp dir for converted images
_tmp = tempfile.mkdtemp(prefix="pptx_icons_")

# Launch headless browser once for all SVG conversions
_pw = sync_playwright().start()
_browser = _pw.chromium.launch()

# ── Animation settings ─────────────────────────────────────────
GIF_FRAME_DELAY_MS = 100    # ~10 fps
GIF_MAX_FRAMES = 120        # hard cap on frames per GIF


def _svg_has_animation(svg_path):
    """Return True if the SVG contains SMIL animation elements."""
    text = Path(svg_path).read_text(errors="ignore")
    return bool(re.search(
        r"<animate\b|<animateTransform\b|<animateMotion\b|<set\b", text
    ))


def _parse_time(val):
    """Convert a SMIL time string like '2s' or '300ms' to float seconds."""
    val = val.strip()
    if val.endswith("ms"):
        return float(val[:-2]) / 1000
    if val.endswith("s"):
        return float(val[:-1])
    try:
        return float(val)
    except ValueError:
        return 0


def _svg_animation_duration(svg_path):
    """Best-effort: find the latest end-point (begin + dur) across all animations.

    For SVGs with repeatCount="indefinite", use the longest repeating dur
    so the GIF captures one full looping cycle.
    """
    text = Path(svg_path).read_text(errors="ignore")
    max_end = 0
    max_repeating_dur = 0
    for m in re.finditer(
        r'<(?:animate|animateTransform|animateMotion|set)\b[^>]*>', text
    ):
        tag = m.group(0)
        begin = 0
        dur = 0
        b = re.search(r'begin="([^"]+)"', tag)
        d = re.search(r'dur="([^"]+)"', tag)
        if b:
            begin = _parse_time(b.group(1))
        if d:
            dur = _parse_time(d.group(1))
        max_end = max(max_end, begin + dur)
        # Track the longest repeating animation cycle
        if 'repeatCount="indefinite"' in tag and dur > 0:
            max_repeating_dur = max(max_repeating_dur, dur)
    # Also check standalone dur= in case some are on outer elements
    for d in re.findall(r'dur="([^"]+)"', text):
        max_end = max(max_end, _parse_time(d))
    result = max_end or 2.0
    # For indefinitely repeating animations, one full cycle is enough
    if max_repeating_dur > 0:
        result = max(result, max_repeating_dur)
    return result


def _svg_loop_start(svg_path):
    """Return the time (in seconds) after which all one-shot animations are done.

    For SVGs that mix fill="freeze" (one-shot) and repeatCount="indefinite"
    animations, this returns when the intro is finished so the GIF can loop
    from just the repeating part.  Returns 0 if there are no one-shot intros.
    """
    text = Path(svg_path).read_text(errors="ignore")
    max_oneshot_end = 0
    has_repeat = False
    max_repeating_dur = 0
    for m in re.finditer(
        r'<(?:animate|animateTransform|animateMotion|set)\b[^>]*>', text
    ):
        tag = m.group(0)
        begin = 0
        dur = 0
        b = re.search(r'begin="([^"]+)"', tag)
        d = re.search(r'dur="([^"]+)"', tag)
        if b:
            begin = _parse_time(b.group(1))
        if d:
            dur = _parse_time(d.group(1))
        if 'repeatCount="indefinite"' in tag:
            has_repeat = True
            if dur > 0:
                max_repeating_dur = max(max_repeating_dur, dur)
        elif 'fill="freeze"' in tag:
            max_oneshot_end = max(max_oneshot_end, begin + dur)
    # Only return a loop start if there are both one-shot and repeating anims
    if has_repeat and max_oneshot_end > 0:
        return max_oneshot_end, max_repeating_dur
    return 0, 0


def svg_to_png(svg_path, size=256, width=None, height=None):
    """Render SVG as a static PNG (last animation frame)."""
    svg_path = Path(svg_path)
    w = width or size
    h = height or size
    png_name = f"{svg_path.stem}_{w}x{h}.png"
    png_path = os.path.join(_tmp, png_name)
    if not os.path.exists(png_path):
        page = _browser.new_page(
            viewport={"width": w, "height": h},
            device_scale_factor=2,
        )
        page.goto(f"file://{svg_path.resolve()}")
        page.evaluate("""() => {
            const svg = document.querySelector('svg');
            if (svg && svg.pauseAnimations) {
                svg.pauseAnimations();
                svg.setCurrentTime(10);
            }
        }""")
        page.screenshot(path=png_path, omit_background=True)
        page.close()
    return png_path


def _capture_frame(page, t):
    """Set SVG to time t, wait for repaint, and return an RGBA PIL Image."""
    page.evaluate(f"""() => {{
        const svg = document.querySelector('svg');
        if (!svg) return;
        if (svg.unpauseAnimations) svg.unpauseAnimations();
        if (svg.setCurrentTime) svg.setCurrentTime({t});
        if (svg.pauseAnimations) svg.pauseAnimations();
    }}""")
    # Double-rAF ensures the browser has fully repainted
    page.evaluate(
        "() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))"
    )
    buf = page.screenshot(omit_background=True)
    return Image.open(BytesIO(buf)).convert("RGBA")


def svg_to_gif(svg_path, size=256, width=None, height=None, hold_end_ms=0,
               loop_only=False):
    """Capture SVG animation frames and stitch into a looping animated GIF.

    Structure: animation frames → hold final state → loop.
    This avoids a blank flash on loop since the last & first visible
    frames are the fully-rendered end state.
    hold_end_ms: milliseconds to hold the final frame before looping.
    loop_only: if True and the SVG has a one-shot intro followed by
               repeating animations, capture only the repeating part.
    """
    svg_path = Path(svg_path)
    w = width or size
    h = height or size
    hold_suffix = f"_hold{hold_end_ms}" if hold_end_ms else ""
    loop_suffix = "_loop" if loop_only else ""
    gif_name = f"{svg_path.stem}_{w}x{h}{hold_suffix}{loop_suffix}.gif"
    gif_path = os.path.join(_tmp, gif_name)
    if os.path.exists(gif_path):
        return gif_path

    dur = _svg_animation_duration(svg_path)
    loop_start, repeating_dur = _svg_loop_start(svg_path)
    page = _browser.new_page(
        viewport={"width": w, "height": h},
        device_scale_factor=2,
    )
    page.goto(f"file://{svg_path.resolve()}")
    page.wait_for_timeout(200)

    if loop_only and loop_start > 0 and repeating_dur > 0:
        # Capture only the repeating part (skip one-shot intro)
        loop_dur = repeating_dur
        frame_count = min(GIF_MAX_FRAMES, max(10, int(loop_dur * 1000 / GIF_FRAME_DELAY_MS)))
        anim_frames = []
        for i in range(frame_count):
            t = loop_start + (i / frame_count) * loop_dur
            anim_frames.append(_capture_frame(page, t))
    else:
        # Capture the full animation from t=0 → t=dur
        frame_count = min(GIF_MAX_FRAMES, max(10, int(dur * 1000 / GIF_FRAME_DELAY_MS)))
        anim_frames = []
        for i in range(frame_count):
            t = (i / frame_count) * dur
            anim_frames.append(_capture_frame(page, t))

    # 2. Use the last animation frame as the hold frame.
    #    Capturing at exactly t=dur can cause a blank frame in some SVGs
    #    because the animation timeline resets, so we use the penultimate
    #    point (t ≈ 0.97*dur) which is the last captured frame.
    hold_frame = anim_frames[-1]

    page.close()

    # 3. Build the GIF: just the animation frames, looping continuously.
    #    Prepend one copy of the end state so the poster/first frame
    #    shows the fully-rendered image (not the blank t=0 state).
    hold_count = max(1, hold_end_ms // GIF_FRAME_DELAY_MS) if hold_end_ms else 1
    frames = [hold_frame.copy() for _ in range(hold_count)] + anim_frames

    # Save RGBA frames as transparent GIF.
    # Pillow handles RGBA→palette conversion with transparency automatically.
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=GIF_FRAME_DELAY_MS,
        loop=0,
        disposal=2,
    )
    return gif_path


def svg_to_image(svg_path, size=256, width=None, height=None, hold_end_ms=0):
    """Return an animated GIF if the SVG has animations, otherwise a static PNG."""
    if _svg_has_animation(svg_path):
        return svg_to_gif(svg_path, size, width, height, hold_end_ms=hold_end_ms)
    return svg_to_png(svg_path, size, width, height)


def add_icon(slide, svg_path, left, top, size=Inches(0.6)):
    """Add an SVG icon (as animated GIF or static PNG) to a slide."""
    img = svg_to_image(svg_path)
    return slide.shapes.add_picture(img, left, top, size, size)

# ── Theme colours ──────────────────────────────────────────────
BG        = RGBColor(0x0F, 0x17, 0x2A)   # --bg: #0f172a
ACCENT    = RGBColor(0x38, 0xBD, 0xF8)   # --accent: #38bdf8
TEXT      = RGBColor(0xF1, 0xF5, 0xF9)   # --text: #f1f5f9
MUTED     = RGBColor(0xB0, 0xBE, 0xC5)   # --text-muted
CARD_BG   = RGBColor(0x33, 0x41, 0x55)   # --card-bg
CARD_BDR  = RGBColor(0x47, 0x55, 0x69)   # --card-border
WARNING   = RGBColor(0xFB, 0xBF, 0x24)   # amber warning
COMPARE_A = RGBColor(0x1E, 0x29, 0x3B)   # darker bg for compare col
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

prs = Presentation()
prs.slide_width = SLIDE_W
prs.slide_height = SLIDE_H

# ── Helpers ────────────────────────────────────────────────────

def set_slide_bg(slide, colour=BG):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = colour


def add_text(slide, text, left, top, width, height, *,
             font_size=18, bold=False, colour=TEXT, alignment=PP_ALIGN.LEFT,
             font_name="Segoe UI"):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = colour
    p.font.name = font_name
    p.alignment = alignment
    return txBox


def add_label(slide, text, top=Inches(0.5)):
    add_text(slide, text.upper(),
             Inches(0.8), top, Inches(4), Inches(0.4),
             font_size=12, bold=True, colour=ACCENT)


def add_title(slide, plain, highlight, top=Inches(0.9)):
    txBox = slide.shapes.add_textbox(Inches(0.8), top, Inches(11.7), Inches(0.9))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    run1 = p.add_run()
    run1.text = plain
    run1.font.size = Pt(36)
    run1.font.bold = True
    run1.font.color.rgb = TEXT
    run1.font.name = "Segoe UI"
    run2 = p.add_run()
    run2.text = highlight
    run2.font.size = Pt(36)
    run2.font.bold = True
    run2.font.color.rgb = ACCENT
    run2.font.name = "Segoe UI"
    return txBox


def add_subtitle(slide, text, top=Inches(1.8), alignment=PP_ALIGN.LEFT):
    add_text(slide, text,
             Inches(0.8), top, Inches(11.7), Inches(0.5),
             font_size=20, colour=MUTED, alignment=alignment)


def add_card(slide, left, top, width, height, texts, *,
             bg=CARD_BG, border=CARD_BDR):
    """texts: list of (text, font_size, bold, colour) tuples."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg
    shape.line.color.rgb = border
    shape.line.width = Pt(1)
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.2)
    tf.margin_right = Inches(0.2)
    tf.margin_top = Inches(0.15)
    for i, (txt, sz, bold, clr) in enumerate(texts):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = txt
        p.font.size = Pt(sz)
        p.font.bold = bold
        p.font.color.rgb = clr
        p.font.name = "Segoe UI"
        p.alignment = PP_ALIGN.CENTER
    return shape


def add_bullet_list(slide, items, left, top, width, height, *,
                    font_size=18, colour=TEXT, spacing=Pt(8)):
    """items: list of (bold_text, desc_text) or plain strings."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.space_after = spacing
        p.font.name = "Segoe UI"
        if isinstance(item, tuple):
            bold_part, desc_part = item
            r1 = p.add_run()
            r1.text = bold_part
            r1.font.size = Pt(font_size)
            r1.font.bold = True
            r1.font.color.rgb = TEXT
            r1.font.name = "Segoe UI"
            if desc_part:
                r2 = p.add_run()
                r2.text = f"  —  {desc_part}"
                r2.font.size = Pt(font_size - 2)
                r2.font.bold = False
                r2.font.color.rgb = MUTED
                r2.font.name = "Segoe UI"
        else:
            p.text = item
            p.font.size = Pt(font_size)
            p.font.color.rgb = colour
    return txBox


def add_icon_rows(slide, rows, *, left=Inches(1.0), top=Inches(2.4),
                  row_h=Inches(0.9), icon_size=Inches(0.55),
                  text_width=Inches(10), font_size=20, desc_size=None):
    """Place icon+text pairs at exact Y positions so they stay aligned.

    rows: list of (svg_path, bold_text, desc_text)
    """
    if desc_size is None:
        desc_size = font_size - 2
    text_left = left + icon_size + Inches(0.25)
    for i, (svg, bold_txt, desc_txt) in enumerate(rows):
        y = top + i * row_h
        # icon vertically centred in row
        icon_y = y + (row_h - icon_size) / 2
        add_icon(slide, svg, left, icon_y, icon_size)
        # text box for this single row
        txBox = slide.shapes.add_textbox(text_left, y, text_width, row_h)
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = 0
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        r1 = p.add_run()
        r1.text = bold_txt
        r1.font.size = Pt(font_size)
        r1.font.bold = True
        r1.font.color.rgb = TEXT
        r1.font.name = "Segoe UI"
        if desc_txt:
            p2 = tf.add_paragraph()
            p2.space_before = Pt(2)
            r2 = p2.add_run()
            r2.text = desc_txt
            r2.font.size = Pt(desc_size)
            r2.font.bold = False
            r2.font.color.rgb = MUTED
            r2.font.name = "Segoe UI"


# ── Slide 1: Title ─────────────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])  # blank
set_slide_bg(sl)
add_text(sl, "AI & the Future",
         Inches(1), Inches(2.4), Inches(11.3), Inches(1.5),
         font_size=54, bold=True, colour=ACCENT,
         alignment=PP_ALIGN.CENTER)
add_text(sl, "Artificial Intelligence · Generative AI · Agents · Vibe Coding",
         Inches(1), Inches(3.9), Inches(11.3), Inches(0.6),
         font_size=22, colour=MUTED, alignment=PP_ALIGN.CENTER)
add_text(sl, "Hosted by Muhammed, Ranjan, Farhad, Kelvin, Chaitanya, Krishna",
         Inches(1), Inches(4.7), Inches(11.3), Inches(0.5),
         font_size=18, colour=MUTED, alignment=PP_ALIGN.CENTER)


# ── Slide 2: Agenda ────────────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Overview")
add_title(sl, "Session ", "Overview")
agenda = [
    "1.  Welcome & Introduction",
    "2.  Ice Breaker & Quiz",
    "3.  How we got here — from Machine Learning to Agents",
    "4.  Generative AI & using it responsibly",
    "5.  Vibe Coding — what & why",
    "6.  Interactive Q&A & demos",
    "7.  Hands‑on Vibe Coding session",
    "8.  Showcase & wrap‑up",
]
add_bullet_list(sl, agenda,
                Inches(1.5), Inches(2.2), Inches(10), Inches(5),
                font_size=20, colour=TEXT)


# ── Slide 3: Team Members ─────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Your Hosts")
add_title(sl, "Team ", "Members")

team = [
    ("RP", "Ranjan Patalasingh", "Principal AI Engineer"),
    ("MM", "Muhammed Miah", "Senior AI Engineer"),
    ("FH", "Farhad Hussain", "Senior AI Engineer"),
    ("KC", "Kelvin Chan", "AI Engineer"),
    ("CK", "Chaitanya Katukuri", "Engineering Lead"),
    ("KK", "Krishna Konduru", "Data Engineer"),
]
card_w = Inches(3.5)
card_h = Inches(1.8)
gap = Inches(0.4)
total_team_w = 3 * card_w + 2 * gap
start_x = (SLIDE_W - total_team_w) / 2
for i, (initials, name, role) in enumerate(team):
    col = i % 3
    row = i // 3
    x = start_x + col * (card_w + gap)
    y = Inches(2.3) + row * (card_h + gap)
    card_shape = add_card(sl, x, y, card_w, card_h, [
        (initials, 24, True, ACCENT),
        (name, 16, True, TEXT),
        (role, 13, False, MUTED),
    ])
    card_shape.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE


# ── Slide 4: Ice Breaker ──────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Warm Up")
add_title(sl, "Let's Break the ", "Ice!")
add_subtitle(sl, "Quick‑fire round — shout your answer!")
add_icon_rows(sl, [
    (ASSETS / "icon-robot.svg",
     "What AI tool have you used in the last week?", ""),
    (ASSETS / "icon-lightbulb.svg",
     "Name one thing you think AI cannot do (yet).", ""),
    (VIBE_ASSETS / "icon-rocket.svg",
     "If you could build any app with AI, what would it be?", ""),
    (VIBE_ASSETS / "icon-target.svg",
     "What do you most want to learn today?", ""),
], left=Inches(1.2), top=Inches(2.6), row_h=Inches(1.0),
   icon_size=Inches(0.55), font_size=22)


# ── Slide 5: Quiz ─────────────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Challenge")
add_title(sl, "", "Quiz")
add_subtitle(sl, "Fast facts — first answer wins")
add_text(sl, "(Interactive quiz content delivered live)",
         Inches(1), Inches(3.2), Inches(11.3), Inches(0.5),
         font_size=20, colour=MUTED, alignment=PP_ALIGN.CENTER)


# ── Slide 6: The Hook ─────────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "The Big Idea")
txBox = slide_shapes = sl.shapes.add_textbox(
    Inches(0.8), Inches(1.5), Inches(11.7), Inches(1.5))
tf = txBox.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
r = p.add_run()
r.text = "What if you could build a website\njust by describing it?"
r.font.size = Pt(36)
r.font.bold = True
r.font.color.rgb = ACCENT
r.font.name = "Segoe UI"
add_text(sl, "No tutorials. No experience needed. Just your ideas.",
         Inches(1), Inches(3.5), Inches(11.3), Inches(0.5),
         font_size=22, colour=MUTED, alignment=PP_ALIGN.CENTER)
# hero-flow graphic (720×200 aspect ratio)
try:
    hero_w = Inches(9)
    hero_h = Inches(2.5)  # 720:200 ≈ 3.6:1
    png = svg_to_image(VIBE_ASSETS / "hero-flow.svg", width=720, height=200, hold_end_ms=500)
    sl.shapes.add_picture(png,
                          Inches(2.2), Inches(4.2), hero_w, hero_h)
except Exception:
    pass


# ── Slide 7: How We Got Here ──────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "The Journey")
add_title(sl, "How We Got Here — From Learning to ", "Doing")
add_subtitle(sl, "AI evolved in three big leaps — each one unlocked the next.")

roles = [
    ("The Analyst", "Machine Learning & Deep Learning · ~2010s",
     "Learns from data, recognises patterns, makes predictions. Classifies what already exists.",
     "Spotify recommendations, FaceID, spam filters."),
    ("The Creator", "LLMs & Generative AI · ~2018–2022",
     "Understands language, then starts generating new things — text, images, code, music.",
     "ChatGPT writing an essay, Midjourney generating artwork."),
    ("The Doer", "Agents · ~2024",
     "AI that can act autonomously — browses the web, runs code, plans multi-step tasks.",
     "GitHub Copilot coding agent building features for you."),
]
role_icons = [
    ASSETS / "icon-analyst.svg",
    ASSETS / "icon-creator.svg",
    ASSETS / "icon-doer.svg",
]
card_w = Inches(3.7)
card_gap = Inches(0.3)
card_top = Inches(2.6)
icon_sz = Inches(0.6)
total_w = 3 * card_w + 2 * card_gap
card_left = (SLIDE_W - total_w) / 2
for i, (title, era, desc, eg) in enumerate(roles):
    x = card_left + i * (card_w + card_gap)
    card_shape = add_card(sl, x, card_top, card_w, Inches(3.2), [
        (title, 20, True, ACCENT),
        (era, 11, False, MUTED),
        (desc, 13, False, TEXT),
        (eg, 11, False, MUTED),
    ])
    card_shape.text_frame.margin_top = Inches(0.8)
    # Icon centred horizontally, inside top of card
    add_icon(sl, role_icons[i],
             x + (card_w - icon_sz) / 2,
             card_top + Inches(0.25),
             icon_sz)

# Payoff banner — icon inside the card on the left
banner_w = Inches(8)
banner_x = (SLIDE_W - banner_w) / 2
add_card(sl, banner_x, Inches(6.2), banner_w, Inches(0.9), [],
         bg=CARD_BG, border=CARD_BDR)
add_icon(sl, VIBE_ASSETS / "icon-rocket.svg", banner_x + Inches(0.15), Inches(6.35), Inches(0.6))
txBox = sl.shapes.add_textbox(banner_x + Inches(0.9), Inches(6.2), banner_w - Inches(1.05), Inches(0.9))
tf = txBox.text_frame
tf.word_wrap = True
tf.margin_left = 0
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
p = tf.paragraphs[0]
p.text = "The Payoff — Vibe Coding (~2025)"
p.font.size = Pt(18)
p.font.bold = True
p.font.color.rgb = ACCENT
p.font.name = "Segoe UI"
p2 = tf.add_paragraph()
p2.text = "Combine the Creator (GenAI that writes code) with the Doer (agents that take action): you describe, AI builds, you see results."
p2.font.size = Pt(13)
p2.font.color.rgb = TEXT
p2.font.name = "Segoe UI"


# ── Slide 8: Generative AI ────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "In the Wild")
add_title(sl, "Generative AI — Where You ", "See It Today")

# How it works
add_text(sl, "How it works", Inches(0.8), Inches(1.9), Inches(4), Inches(0.4),
         font_size=16, bold=True, colour=ACCENT)
add_icon_rows(sl, [
    (VIBE_ASSETS / "icon-describe.svg",
     "You write a prompt", "Describe what you want in plain language"),
    (ASSETS / "icon-flow.svg",
     "The model processes it", "Breaks your words into tokens and predicts what comes next"),
    (ASSETS / "icon-genai.svg",
     "You get the output", "Text, an image, code, audio, or video"),
], left=Inches(0.8), top=Inches(2.4), row_h=Inches(1.0),
   icon_size=Inches(0.5), text_width=Inches(5.2), font_size=14)

# Tools grid
add_text(sl, "Tools you might already know", Inches(7), Inches(1.9), Inches(5.5), Inches(0.4),
         font_size=16, bold=True, colour=ACCENT)
tool_icons = [
    ASSETS / "icon-chat.svg",
    ASSETS / "icon-image-video.svg",
    ASSETS / "icon-code.svg",
    ASSETS / "icon-audio.svg",
]
tools = [
    ("Text & Chat", "ChatGPT, Claude, Gemini, Grok"),
    ("Images & Video", "GPT Image, Midjourney, Google Veo"),
    ("Code Generation", "GitHub Copilot, Cursor, Claude Code"),
    ("Audio & Music", "ElevenLabs, Suno, Udio"),
]
tw = Inches(2.7)
th = Inches(1.2)
tool_icon_sz = Inches(0.4)
for i, (name, desc) in enumerate(tools):
    col = i % 2
    row = i // 2
    x = Inches(7) + col * (tw + Inches(0.2))
    y = Inches(2.5) + row * (th + Inches(0.2))
    # Card text offset to right of icon
    txt_x = x + Inches(0.15) + tool_icon_sz + Inches(0.1)
    txt_w = tw - Inches(0.15) - tool_icon_sz - Inches(0.25)
    add_card(sl, x, y, tw, th, [], bg=CARD_BG, border=CARD_BDR)
    add_icon(sl, tool_icons[i], x + Inches(0.15), y + (th - tool_icon_sz) / 2, tool_icon_sz)
    txBox = sl.shapes.add_textbox(txt_x, y, txt_w, th)
    tf = txBox.text_frame
    tf.word_wrap = True
    tf.margin_left = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = name
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = TEXT
    p.font.name = "Segoe UI"
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(11)
    p2.font.color.rgb = MUTED
    p2.font.name = "Segoe UI"

# Warning banner
warn_w = Inches(8)
warn_x = (SLIDE_W - warn_w) / 2
add_card(sl, warn_x, Inches(6.0), warn_w, Inches(1.0), [],
         bg=RGBColor(0x2D, 0x1F, 0x00), border=WARNING)
add_icon(sl, ASSETS / "icon-warning.svg", warn_x + Inches(0.15), Inches(6.25), Inches(0.5))
txBox = sl.shapes.add_textbox(warn_x + Inches(0.8), Inches(6.0), warn_w - Inches(0.95), Inches(1.0))
tf = txBox.text_frame
tf.word_wrap = True
tf.margin_left = 0
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
p = tf.paragraphs[0]
p.text = "⚠  Hallucination warning"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = WARNING
p.font.name = "Segoe UI"
p2 = tf.add_paragraph()
p2.text = "Generative AI can confidently produce wrong answers. It sounds right, reads right, but it's made up. Always verify."
p2.font.size = Pt(13)
p2.font.color.rgb = TEXT
p2.font.name = "Segoe UI"


# ── Slide 9: Use AI Responsibly ────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Stay Sharp")
add_title(sl, "Use AI ", "Responsibly")
add_subtitle(sl, "AI is powerful — but it's not perfect. Here are things to watch out for:")
add_icon_rows(sl, [
    (ASSETS / "icon-deepfake.svg",
     "Deepfakes", "AI can create convincing fake images, audio, and video of real people"),
    (ASSETS / "icon-bias.svg",
     "Bias", "AI learns from human data — so it can repeat unfair patterns and stereotypes"),
    (ASSETS / "icon-misinfo.svg",
     "Misinformation", "AI-generated text can sound authoritative even when it's completely wrong"),
    (ASSETS / "icon-copyright.svg",
     "Copyright", "AI may generate content that's too similar to someone else's work"),
], left=Inches(1.0), top=Inches(2.3), row_h=Inches(1.0),
   icon_size=Inches(0.6), text_width=Inches(10), font_size=20)


# ── Slide 10: What is Vibe Coding? ─────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "The Idea")
add_title(sl, "What is ", "Vibe Coding?")
add_icon_rows(sl, [
    (VIBE_ASSETS / "icon-describe.svg",
     "You describe", "Tell AI what you want in plain English"),
    (VIBE_ASSETS / "icon-ai.svg",
     "AI builds", "GitHub Copilot writes the code for you"),
    (VIBE_ASSETS / "icon-browser.svg",
     "You see results", "Open the browser and watch it come to life"),
], left=Inches(1.0), top=Inches(2.3), row_h=Inches(1.2),
   icon_size=Inches(0.6), text_width=Inches(10), font_size=22)


# ── Slide 11: Why Vibe Coding Matters ──────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Why It Matters")
add_title(sl, "Why Vibe Coding ", "Matters")
add_icon_rows(sl, [
    (ASSETS / "icon-nosyntax.svg",
     "No syntax memorisation needed", "Describe ideas in plain English"),
    (ASSETS / "icon-iterate.svg",
     "Iterate in seconds, not hours", "See results in your browser almost immediately"),
    (ASSETS / "icon-learn.svg",
     "Learn by doing", "Read & edit AI-generated code to understand how it works"),
    (ASSETS / "icon-prototype.svg",
     "Ideal for prototypes & side projects", "Go from idea to working thing fast"),
], left=Inches(0.8), top=Inches(2.3), row_h=Inches(0.9),
   icon_size=Inches(0.55), text_width=Inches(6.2), font_size=18)

# Comparison grid
cw = Inches(3.2)
ch = Inches(2.1)
comp_x = Inches(8.3)
add_card(sl, comp_x, Inches(1.8), cw, ch, [
    ("Traditional coding", 16, True, TEXT),
    ("Write every line manually", 13, False, MUTED),
    ("Debug from scratch", 13, False, MUTED),
    ("Steep learning curve", 13, False, MUTED),
], bg=COMPARE_A)
add_card(sl, comp_x, Inches(4.1), cw, ch, [
    ("Vibe coding", 16, True, ACCENT),
    ("Describe → review → refine", 13, False, TEXT),
    ("AI helps find & fix issues", 13, False, TEXT),
    ("Low barrier to entry", 13, False, TEXT),
])


# ── Slide 12: What's Possible ─────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "What's Possible")
add_title(sl, "People have already built ", "all of this")
PROJ_ROOT = HERE.parent
projects = [
    ("Pixel Art Editor", PROJ_ROOT / "pixel-art-editor" / "assets" / "thumbnail.png"),
    ("Snake Game", PROJ_ROOT / "snake-with-powerups" / "assets" / "thumbnail.png"),
    ("Beat Maker", PROJ_ROOT / "beat-maker" / "assets" / "thumbnail.png"),
    ("Personality Quiz", PROJ_ROOT / "personality-quiz" / "assets" / "thumbnail.png"),
    ("Dungeon Crawler", PROJ_ROOT / "dungeon-crawler" / "assets" / "thumbnail.png"),
    ("Weather Dashboard", PROJ_ROOT / "weather-dashboard" / "assets" / "thumbnail.png"),
    ("Endless Runner", PROJ_ROOT / "endless-runner" / "assets" / "thumbnail.png"),
    ("Memory Match", PROJ_ROOT / "memory-card-match" / "assets" / "thumbnail.png"),
]
pw = Inches(2.85)
img_h = Inches(1.6)
label_h = Inches(0.4)
ph = img_h + label_h
gap = Inches(0.2)
total_proj_w = 4 * pw + 3 * gap
proj_left = (SLIDE_W - total_proj_w) / 2
for i, (name, thumb) in enumerate(projects):
    col = i % 4
    row = i // 4
    x = proj_left + col * (pw + gap)
    y = Inches(2.0) + row * (ph + gap)
    # Card background
    add_card(sl, x, y, pw, ph, [], bg=CARD_BG, border=CARD_BDR)
    # Thumbnail image (rounded corners to match card)
    pic = sl.shapes.add_picture(str(thumb), x + Inches(0.1), y + Inches(0.08),
                                pw - Inches(0.2), img_h - Inches(0.15))
    prstGeom = pic._element.spPr.find(qn('a:prstGeom'))
    prstGeom.set('prst', 'roundRect')
    avLst = prstGeom.find(qn('a:avLst'))
    gd = avLst.makeelement(qn('a:gd'), {'name': 'adj', 'fmla': 'val 5000'})
    avLst.append(gd)
    # Label below image
    add_text(sl, name, x, y + img_h - Inches(0.05), pw, label_h,
             font_size=13, bold=True, colour=TEXT, alignment=PP_ALIGN.CENTER)
add_subtitle(sl, "All built by describing ideas in plain English — no coding experience needed.",
             top=Inches(6.7), alignment=PP_ALIGN.CENTER)


# ── Slide 13: Q&A ─────────────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Ask Us Anything")
add_title(sl, "Interactive Q&A & ", "Live Demo")
add_text(sl, "Got questions? Curious about something?\nNow's the time — ask us anything!",
         Inches(1), Inches(3.2), Inches(11.3), Inches(1),
         font_size=24, colour=MUTED, alignment=PP_ALIGN.CENTER)


# ── Slide 14: Tips ─────────────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Let's Go!")
add_title(sl, "Quick tips before you ", "start")
tip_icons = [
    VIBE_ASSETS / "icon-target.svg",
    VIBE_ASSETS / "icon-blocks.svg",
    VIBE_ASSETS / "icon-flask.svg",
]
tips = [
    ("🎯 Be specific",
     "\"Add a red button that plays a drum sound\" works way better than \"make it cool\""),
    ("🧱 Build step by step",
     "Start simple, then keep adding. Don't try to describe everything at once."),
    ("🧪 Experiment!",
     "Nothing can break permanently. Just try things and see what happens."),
]
tw = Inches(3.7)
card_top = Inches(2.8)
tip_icon_sz = Inches(0.6)
tip_gap = Inches(0.3)
total_tip_w = 3 * tw + 2 * tip_gap
tip_left = (SLIDE_W - total_tip_w) / 2
for i, (title, desc) in enumerate(tips):
    x = tip_left + i * (tw + tip_gap)
    card_shape = add_card(sl, x, card_top, tw, Inches(3), [
        (title, 22, True, TEXT),
        ("", 8, False, MUTED),
        (desc, 15, False, MUTED),
    ])
    card_shape.text_frame.margin_top = Inches(0.85)
    # Icon centred horizontally, between card top and text
    add_icon(sl, tip_icons[i],
             x + (tw - tip_icon_sz) / 2,
             card_top + Inches(0.35),
             tip_icon_sz)


# ── Slide 15: Hands-On ────────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Your Turn")
add_title(sl, "Hands‑On: Build Something ", "Today!")

add_icon_rows(sl, [
    (VIBE_ASSETS / "icon-idea.svg",
     "1. Pick your idea", "Choose a starter or dream up your own"),
    (VIBE_ASSETS / "icon-describe.svg",
     "2. Build with AI", "Describe what you want in plain English"),
    (VIBE_ASSETS / "icon-browser.svg",
     "3. Test & fix", "See results, tweak, iterate"),
    (ASSETS / "icon-showcase.svg",
     "4. Demo to the group", "Show off what you built!"),
], left=Inches(0.8), top=Inches(2.2), row_h=Inches(1.0),
   icon_size=Inches(0.5), text_width=Inches(5.2), font_size=18)

# Project ideas
add_text(sl, "Project ideas (or choose your own!)",
         Inches(7), Inches(2.0), Inches(5.5), Inches(0.4),
         font_size=16, bold=True, colour=ACCENT)
ideas = [
    ("🧠 Quiz generator", "Build a web quiz on any topic you love"),
    ("🍳 Recipe recommender", "Type ingredients, get a recipe"),
    ("📚 Study planner", "AI that schedules A-Level revision"),
    ("🗣️ Chatbot persona", "A bot that talks like a historical figure"),
    ("🎮 Mini game", "Text-based adventure or number guessing game"),
    ("🌍 Climate dashboard", "Visualise climate data with charts and facts"),
]
iw = Inches(2.7)
ih = Inches(1.3)
for i, (title, desc) in enumerate(ideas):
    col = i % 2
    row = i // 2
    x = Inches(7) + col * (iw + Inches(0.15))
    y = Inches(2.6) + row * (ih + Inches(0.15))
    add_card(sl, x, y, iw, ih, [
        (title, 13, True, TEXT),
        (desc, 11, False, MUTED),
    ])


# ── Slide 16: Showcase & Wrap-Up ──────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_label(sl, "Finale")
add_title(sl, "Showcase & ", "Wrap‑Up")
add_subtitle(sl, "Each group: 60–120 seconds to demo what you built.")

add_text(sl, "Key takeaways", Inches(0.8), Inches(2.6), Inches(4), Inches(0.4),
         font_size=16, bold=True, colour=ACCENT)
add_icon_rows(sl, [
    (ASSETS / "icon-analyst.svg",
     "AI is a tool", "The human with the best questions wins"),
    (ASSETS / "icon-creator.svg",
     "Analyst → Creator → Doer",
     "The Analyst recognises → the Creator generates → the Doer acts — each built on the last"),
    (VIBE_ASSETS / "icon-rocket.svg",
     "Vibe coding", "Lets you ship ideas without years of training"),
], left=Inches(1.0), top=Inches(3.2), row_h=Inches(1.0),
   icon_size=Inches(0.6), text_width=Inches(10), font_size=20)


# ── Slide 17: Thank You ───────────────────────────────────────
sl = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(sl)
add_text(sl, "Thank You",
         Inches(1), Inches(2.3), Inches(11.3), Inches(1.5),
         font_size=54, bold=True, colour=ACCENT,
         alignment=PP_ALIGN.CENTER)
add_text(sl, "Now go build something amazing!",
         Inches(1), Inches(4.0), Inches(11.3), Inches(0.6),
         font_size=24, colour=TEXT, alignment=PP_ALIGN.CENTER)
add_text(sl, "Go! 🚀",
         Inches(1), Inches(5.0), Inches(11.3), Inches(0.8),
         font_size=32, bold=True, colour=ACCENT,
         alignment=PP_ALIGN.CENTER)


# ── Save ───────────────────────────────────────────────────────
out = "AI_and_the_Future.pptx"
prs.save(out)

_browser.close()
_pw.stop()

print(f"✅ Saved {out} ({len(prs.slides)} slides)")
