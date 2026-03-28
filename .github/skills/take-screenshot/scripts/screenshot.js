/**
 * Take a screenshot of a single project and generate a 256px thumbnail.
 *
 * Usage:
 *   node .github/skills/take-screenshot/scripts/screenshot.js <project-folder>
 *
 * Example:
 *   node .github/skills/take-screenshot/scripts/screenshot.js my-cool-site
 *
 * Outputs:
 *   <project-folder>/assets/screenshot.png
 *   <project-folder>/assets/thumbnail.png
 */

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const projectName = process.argv[2];

if (!projectName) {
  console.error('Usage: node screenshot.js <project-folder>');
  process.exit(1);
}

const projectDir = path.join(ROOT, projectName);

if (!fs.existsSync(path.join(projectDir, 'index.html'))) {
  console.error(`No index.html found in ${projectName}/`);
  process.exit(1);
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.ogg': 'audio/ogg',
};

function createServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(projectDir, req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
      const ext = path.extname(filePath).toLowerCase();
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function main() {
  const assetsDir = path.join(projectDir, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const screenshotPath = path.join(assetsDir, 'screenshot.png');
  const thumbnailPath = path.join(assetsDir, 'thumbnail.png');

  console.log(`📸 Taking screenshot of ${projectName}...`);

  const { server, port } = await createServer();
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: screenshotPath, fullPage: false });
    await page.close();
    console.log(`   ✅ Screenshot saved: ${projectName}/assets/screenshot.png`);
  } catch (err) {
    console.error(`   ❌ Screenshot failed: ${err.message}`);
    await browser.close();
    server.close();
    process.exit(1);
  }

  await browser.close();
  server.close();

  // Generate thumbnail
  try {
    execSync(`sips --resampleHeight 256 "${screenshotPath}" --out "${thumbnailPath}"`, { stdio: 'pipe' });
    console.log(`   ✅ Thumbnail saved: ${projectName}/assets/thumbnail.png`);
  } catch {
    console.log(`   ⚠️  Thumbnail generation skipped (sips not available — macOS only)`);
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
