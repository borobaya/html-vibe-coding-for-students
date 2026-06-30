"""No-cache development server.

Usage:
    python3 server.py              → serves current folder on port 5500
    python3 server.py 8080         → serves on port 8080

Optional AI chat:
    set OPENAI_API_KEY in your terminal before starting the server.
"""

import http.server
import json
import os
import sys
import urllib.error
import urllib.request


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files with headers that prevent browser caching."""

    def do_POST(self):
        if self.path != "/api/globot":
            self.send_error(404, "Not found")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON."}, status=400)
            return

        message = str(payload.get("message", "")).strip()
        if not message:
            self._send_json({"error": "Message is required."}, status=400)
            return

        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            self._send_json({"error": "AI is not connected yet. Set OPENAI_API_KEY, restart the server, then try again."}, status=503)
            return

        try:
            reply = ask_globot(api_key, message[:600])
        except (urllib.error.URLError, TimeoutError, KeyError, ValueError) as error:
            self._send_json({"error": f"GloBot could not reach the AI service: {error}"}, status=502)
            return

        self._send_json({"reply": reply})

    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def ask_globot(api_key, message):
    """Gets a short, supportive educational response from an AI model."""
    request_body = {
        "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are GloBot, a warm educational wellbeing chat helper inside a student app for girls and young women. "
                    "Give concise, supportive, age-appropriate educational advice about confidence, fitness, sleep, school-life balance, stress, and general wellbeing. "
                    "Do not diagnose, prescribe, discuss weight-loss diets, or replace medical or mental-health care. "
                    "Encourage safe movement, rest, hydration, trusted adults, and qualified professionals when needed. "
                    "If the user mentions self-harm, abuse, danger, or feeling unsafe, tell them to contact a trusted adult or local emergency/crisis support now. "
                    "Keep responses under 90 words."
                ),
            },
            {"role": "user", "content": message},
        ],
        "temperature": 0.7,
        "max_tokens": 140,
    }

    request = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=25) as response:
        data = json.loads(response.read().decode("utf-8"))
        return data["choices"][0]["message"]["content"].strip()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
print(f"Serving at http://localhost:{port}  (caching disabled)")
http.server.HTTPServer(("", port), NoCacheHandler).serve_forever()
