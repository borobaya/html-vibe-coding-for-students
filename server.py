"""No-cache development server.

Usage:
    python3 server.py              → serves current folder on port 5500
    python3 server.py 8080         → serves on port 8080
"""

import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files with headers that prevent browser caching."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
print(f"Serving at http://localhost:{port}  (caching disabled)")
http.server.HTTPServer(("", port), NoCacheHandler).serve_forever()
