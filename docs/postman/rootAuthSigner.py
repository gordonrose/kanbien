import base64
import json
import os
from hashlib import sha256
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

DEFAULT_PRIVATE_KEY_PATH = str(Path.home() / ".ssh" / "id_ed25519")
PRIVATE_KEY_PATH = os.environ.get("ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH", DEFAULT_PRIVATE_KEY_PATH)
HOST = os.environ.get("ROOT_AUTH_SIGNER_HOST", "127.0.0.1")
PORT = int(os.environ.get("ROOT_AUTH_SIGNER_PORT", "8787"))


with open(PRIVATE_KEY_PATH, "rb") as key_file:
    private_key = serialization.load_ssh_private_key(key_file.read(), password=None)

if not isinstance(private_key, Ed25519PrivateKey):
    raise RuntimeError("Only Ed25519 private keys are supported by this signer")

public_key = private_key.public_key()
public_key_bytes = public_key.public_bytes(
    encoding=serialization.Encoding.Raw,
    format=serialization.PublicFormat.Raw,
)


def ssh_string(raw: bytes) -> bytes:
    return len(raw).to_bytes(4, "big") + raw


def build_fingerprint() -> str:
    blob = ssh_string(b"ssh-ed25519") + ssh_string(public_key_bytes)
    digest = sha256(blob).digest()
    return "SHA256:" + base64.b64encode(digest).decode("ascii").rstrip("=")


PUBLIC_KEY_FINGERPRINT = build_fingerprint()


class SignHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        if self.path != "/sign":
            self._send_json(404, {"code": "NOT_FOUND", "message": "Not found"})
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
            challenge_text = payload.get("challengeText")
            if not isinstance(challenge_text, str) or not challenge_text:
                self._send_json(
                    400,
                    {"code": "INVALID_REQUEST", "message": "challengeText is required"},
                )
                return

            signature = private_key.sign(challenge_text.encode("utf-8"))
            self._send_json(
                200,
                {
                    "signature": base64.b64encode(signature).decode("ascii"),
                    "publicKeyFingerprint": PUBLIC_KEY_FINGERPRINT,
                },
            )
        except Exception as error:
            self._send_json(500, {"code": "SIGNING_FAILED", "message": str(error)})

    def log_message(self, _format: str, *_args) -> None:
        return


if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), SignHandler)
    print(f"Root auth signer listening on http://{HOST}:{PORT}")
    print(f"Using private key: {PRIVATE_KEY_PATH}")
    print(f"Fingerprint: {PUBLIC_KEY_FINGERPRINT}")
    print("Override ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH if you want to use a different key.")
    server.serve_forever()
