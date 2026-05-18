const puppeteer = require("puppeteer");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// All project folders with an index.html
const projects = fs
  .readdirSync(ROOT)
  .filter((name) => {
    const full = path.join(ROOT, name);
    return (
      fs.statSync(full).isDirectory() &&
      fs.existsSync(path.join(full, "index.html"))
    );
  });

// ── Per-project interactions ────────────────────────────────────────
// Each function receives the Puppeteer page and runs actions to make
// the screenshot more representative of actual use.

const interactions = {
  "beat-maker": async (page) => {
    await page.evaluate(() => {
      const pads = document.querySelectorAll(".sequencer__pad");
      // Classic rock-ish pattern across the 6×16 grid
      [0, 4, 8, 12, 17, 21, 25, 29, 34, 38, 42, 46, 51, 55, 59, 63, 66, 70, 74, 78, 83, 87, 91, 95]
        .forEach((i) => { if (pads[i]) pads[i].click(); });
    });
    await wait(500);
  },

  "budget-tracker": async (page) => {
    // Add income
    await page.select("#type", "income");
    await page.type("#amount", "2500");
    await page.type("#description", "Monthly Salary");
    await page.$eval("#date", (el) => (el.value = "2026-03-01"));
    await page.click(".btn--primary");
    await wait(300);
    // Add expense 1
    await page.select("#type", "expense");
    await page.type("#amount", "85.50");
    await page.type("#description", "Grocery Shopping");
    await page.$eval("#date", (el) => (el.value = "2026-03-05"));
    await page.click(".btn--primary");
    await wait(300);
    // Add expense 2
    await page.select("#type", "expense");
    await page.type("#amount", "45");
    await page.type("#description", "Internet Bill");
    await page.$eval("#date", (el) => (el.value = "2026-03-10"));
    await page.click(".btn--primary");
    await wait(300);
  },

  "dungeon-crawler": async (page) => {
    await page.click("#btn-new-game");
    await wait(1000);
  },
},
  },
await page.$eval("#contactName", (el) =>
  await wait(300);
await page.type("#input-question", "What is the chemical symbol for water?");
await wait(300);

await page.evaluate(() => {
  await page.type("#input-habit-name", "Drink water");

  canvas.toBlob((blob) => {
        );
  await page.type("#bottom-text", "ON THE FIRST TRY");
  await page.click("#start-btn");
},
      const colours = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FF8C00", "#00CED1"];
await wait(1000);

// Only kept projects below
"tower-defence": async (page) => {
  await wait(1000);
  const buildBtns = await page.$$("#build-menu button");
  if (buildBtns.length > 0) await buildBtns[0].click();
  await wait(300);
  await page.click("#btn-start-wave");
  await wait(2000);
},

  "typing-speed-racer": async (page) => {
    await page.click("#start-btn");
    await wait(4000);
    try {
      const words = await page.$eval("#word-queue", (el) =>
        el.textContent.trim().split(/\s+/).slice(0, 3)
      );
      for (const w of words) {
        await page.type("#typing-input", w + " ", { delay: 50 });
      }
    } catch (e) { /* word queue might not be ready */ }
    await wait(500);
  },

    "zodiac-compatibility": async (page) => {
      await page.$eval("#birthday-1", (el) => {
        el.value = "1999-07-15";
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await wait(500);
      await page.$eval("#birthday-2", (el) => {
        el.value = "2000-03-22";
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("input", { bubbles: true }));
      });
      await wait(500);
      await page.click("#check-btn");
      await wait(1500);
    },
};

// ── Static file server ──────────────────────────────────────────────

function createServer(projectDir) {
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(projectDir, req.url === "/" ? "index.html" : req.url);
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
    });

    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(`Found ${projects.length} projects to screenshot.\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const project of projects) {
    const projectDir = path.join(ROOT, project);
    const assetsDir = path.join(projectDir, "assets");

    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    const screenshotPath = path.join(assetsDir, "screenshot.png");
    const hasInteraction = project in interactions;

    console.log(`📸 ${project}${hasInteraction ? " (with interaction)" : ""}...`);

    const { server, port } = await createServer(projectDir);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(`http://127.0.0.1:${port}/`, {
        waitUntil: "networkidle2",
        timeout: 15000,
      });

      // Let initial rendering, animations and API calls settle
      await wait(2000);

      // Run project-specific interactions if defined
      if (hasInteraction) {
        try {
          await interactions[project](page);
        } catch (err) {
          console.log(`   ⚠️  Interaction issue: ${err.message}`);
        }
      }

      // Final settle after interactions
      await wait(1000);

      await page.screenshot({ path: screenshotPath, fullPage: false });
      await page.close();

      console.log(`   ✅ Saved to ${project}/assets/screenshot.png`);
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }

    server.close();
  }

  await browser.close();
  console.log("\nDone! All screenshots saved.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
