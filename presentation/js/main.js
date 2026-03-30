(function () {
"use strict";

const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentSlideEl = document.getElementById("currentSlide");
const totalSlidesEl = document.getElementById("totalSlides");
const progressFill = document.getElementById("progressFill");
const keyboardHint = document.getElementById("keyboardHint");

// Accessible live region for slide announcements
const liveRegion = document.createElement("div");
liveRegion.setAttribute("aria-live", "polite");
liveRegion.setAttribute("aria-atomic", "true");
liveRegion.className = "sr-only";
liveRegion.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;";
document.body.appendChild(liveRegion);

let current = 0;
let isAnimating = false;
const total = slides.length;

totalSlidesEl.textContent = total;

// Initialise progress bar
progressFill.style.width = (1 / total) * 100 + "%";

// Initialise aria-hidden on all non-active slides
slides.forEach((slide, i) => {
  if (i !== 0) {
    slide.setAttribute("aria-hidden", "true");
  }
});

// ---- Staggered entrance animations ----
function animateSlide(slide) {
  const items = slide.querySelectorAll(".animate-in");
  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
}

// Reset delays when leaving a slide so re-entry re-staggers
function resetSlide(slide) {
  const items = slide.querySelectorAll(".animate-in");
  items.forEach((el) => {
    el.style.transitionDelay = "0s";
  });
}

// Animate the first slide on load
animateSlide(slides[0]);

// Restart SVG animations by re-setting the src
function restartSVGs(slide) {
  const imgs = slide.querySelectorAll('img[src$=".svg"]');
  imgs.forEach((img) => {
    const src = img.getAttribute("src");
    img.removeAttribute("src");
    requestAnimationFrame(() => {
      img.setAttribute("src", src);
    });
  });
}

function goToSlide(index) {
  if (index < 0 || index >= total) return;

  // If already navigating, cancel the previous animation timer
  if (isAnimating) {
    // Let the new navigation proceed immediately
  }

  isAnimating = true;

  // Hide outgoing slide
  resetSlide(slides[current]);
  slides[current].classList.add("exiting");
  slides[current].classList.remove("active");
  slides[current].setAttribute("aria-hidden", "true");

  const prevSlide = slides[current];
  setTimeout(() => {
    prevSlide.classList.remove("exiting");
    isAnimating = false;
  }, 500);

  current = index;

  // Reset click-reveal items when arriving at the ice breaker slide
  if (slides[current].getAttribute("data-slide") === "4") {
    resetClickReveal();
  }

  // Show incoming slide
  animateSlide(slides[current]);
  restartSVGs(slides[current]);
  slides[current].classList.add("active");
  slides[current].removeAttribute("aria-hidden");
  currentSlideEl.textContent = current + 1;
  progressFill.style.width = ((current + 1) / total) * 100 + "%";

  // Focus the slide heading for screen readers
  const heading = slides[current].querySelector("h1");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  // Announce to screen readers
  liveRegion.textContent = "Slide " + (current + 1) + " of " + total;

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === total - 1;

  keyboardHint.classList.add("hidden");
}

// ---- Floating particles background ----
function createParticles() {
  const container = document.getElementById("particles");
  const count = 25;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.bottom = -(Math.random() * 20) + "%";
    particle.style.width = (2 + Math.random() * 3) + "px";
    particle.style.height = particle.style.width;
    particle.style.animationDuration = (8 + Math.random() * 12) + "s";
    particle.style.animationDelay = (Math.random() * 10) + "s";
    particle.style.opacity = 0;
    container.appendChild(particle);
  }
}

createParticles();

// ---- Click-to-reveal on ice breaker slide ----
const clickRevealItems = document.querySelectorAll("#icebreaker-list .click-reveal");
let revealIndex = 0;

function resetClickReveal() {
  revealIndex = 0;
  clickRevealItems.forEach(function (el) {
    el.classList.remove("revealed");
  });
}

function revealNext() {
  if (revealIndex < clickRevealItems.length) {
    clickRevealItems[revealIndex].classList.add("revealed");
    revealIndex++;
    return true; // consumed the click
  }
  return false; // all revealed, let navigation proceed
}

function isOnClickRevealSlide() {
  return slides[current] && slides[current].getAttribute("data-slide") === "4";
}

function next() {
  if (isOnClickRevealSlide() && revealNext()) return;
  goToSlide(current + 1);
}

function prev() {
  goToSlide(current - 1);
}

// Button clicks
nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

// Click anywhere on slide 4 to reveal next item
document.addEventListener("click", function (e) {
  if (!isOnClickRevealSlide()) return;
  // Ignore clicks on nav buttons
  if (e.target.closest(".slide-nav")) return;
  revealNext();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    next();
  } else if (e.key === " " && !["BUTTON", "INPUT", "TEXTAREA", "SELECT", "A"].includes(document.activeElement.tagName)) {
    e.preventDefault();
    next();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    prev();
  }
});

// Touch swipe support
let touchStartX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 60) {
    if (diff > 0) {
      next();
    } else {
      prev();
    }
  }
}, { passive: true });

// Initial state
prevBtn.disabled = true;
nextBtn.disabled = total <= 1;

// Loop the workflow SVG on slide 10: restart it 3s after animations finish (~8s)
const workflowSvg = document.getElementById("workflowSvg");
if (workflowSvg) {
  const svgSrc = workflowSvg.getAttribute("src");
  let svgLoop = null;
  function startSvgLoop() {
    stopSvgLoop();
    workflowSvg.setAttribute("src", "");
    workflowSvg.setAttribute("src", svgSrc);
    svgLoop = setInterval(function () {
      workflowSvg.setAttribute("src", "");
      workflowSvg.setAttribute("src", svgSrc);
    }, 11000);
  }
  function stopSvgLoop() {
    if (svgLoop) { clearInterval(svgLoop); svgLoop = null; }
  }
  // Observe class changes on all slides to detect navigation
  const observer = new MutationObserver(function () {
    const activeSlide = document.querySelector(".slide.active");
    if (activeSlide && activeSlide.getAttribute("data-slide") === "10") {
      if (!svgLoop) startSvgLoop();
    } else {
      stopSvgLoop();
    }
  });
  slides.forEach(function (s) {
    observer.observe(s, { attributes: true, attributeFilter: ["class"] });
  });
}

})();
