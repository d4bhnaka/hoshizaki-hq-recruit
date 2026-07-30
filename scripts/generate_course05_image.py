"""1Day 管理部門コース(course-05)の掲載写真を GPT Image 2 で再生成する。

20代女性の先輩社員が、大学生インターン(女性)に財務諸表の見方・分析の仕方を
笑顔でレクチャーしているカット。明るく正しいホワイトバランス、人物中心で
背景は強くぼかして目立たせない構図。720x540(4:3)にリサイズして
public/images/internship/course-05.webp を上書きする。

必要: .env の OPENAI_API_KEY、Pillow。実行: python3 scripts/generate_course05_image.py
"""

import base64
import json
import os
import sys
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(ROOT, "public/images/internship/course-05.webp")
SCRATCH = os.path.join(ROOT, "scripts", "_course05_raw")
os.makedirs(SCRATCH, exist_ok=True)

API_KEY = None
with open(os.path.join(ROOT, ".env")) as f:
    for line in f:
        if line.startswith("OPENAI_API_KEY="):
            API_KEY = line.split("=", 1)[1].strip()
if not API_KEY:
    sys.exit("no key")

PROMPT = """Photorealistic corporate stock photography, shot on a full-frame camera \
with a bright, clean, accurate neutral white balance (no dim shadows, no orange or \
blue color cast, crisp bright even exposure like a well-lit indoor photo).

Composition: the two people fill most of the frame, shot fairly close/tight (upper \
body framing), so the background is only a small, heavily blurred sliver at the \
edges — a hint of an ordinary Japanese office (soft-focus beige desks, a blurred \
gray-green partition panel) barely recognizable, out of focus, not a major part of \
the image. The people, not the room, are clearly the subject.

Subjects: TWO Japanese women, both smiling and looking genuinely happy/engaged. \
One is a company employee in her mid-20s (dark navy blazer over a plain top), the \
other is a university student on a one-day internship (smart-casual clothing, e.g. \
a simple cardigan or blouse, no blazer, looking slightly more junior/youthful). They \
are sitting or standing close together at a desk, both looking at the same laptop \
screen and a printed financial statement sheet with bar and pie charts on the desk \
between them. The employee is warmly explaining and pointing at a line on the \
printed financial statement / the laptop chart with a pen, in the middle of a \
friendly lecture. The student is smiling, nodding, leaning in with interest, maybe \
holding a notebook and pen for taking notes. Both faces are clearly visible, \
well-lit, cheerful, natural expressions — a fun, encouraging, welcoming mood, not \
a stiff or serious mood.

No text overlays, no logos, no watermarks. High-quality realistic photograph, not \
illustration, not 3D render, not overly dark or moody."""


def request_image() -> dict:
    body = json.dumps(
        {
            "model": "gpt-image-2",
            "prompt": PROMPT,
            "size": "1024x768",
            # "high" reliably exceeds this environment's ~60s outbound request
            # cap and drops the connection before OpenAI responds; "medium"
            # finishes just under it and is already excellent quality.
            "quality": "medium",
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=600) as res:
        return json.load(res)


def main() -> None:
    last_err = None
    data = None
    for attempt in range(3):
        try:
            data = request_image()
            break
        except Exception as e:  # RemoteDisconnected etc. near the time cap
            last_err = e
            print(f"attempt {attempt + 1} failed: {e}", file=sys.stderr)
    if data is None:
        raise last_err

    raw = base64.b64decode(data["data"][0]["b64_json"])
    raw_path = os.path.join(SCRATCH, "raw_course-05.png")
    with open(raw_path, "wb") as f:
        f.write(raw)

    img = Image.open(raw_path).convert("RGB")
    resized = img.resize((720, 540), Image.LANCZOS)
    resized.save(OUT_PATH, "WEBP", quality=85)
    print(f"saved {OUT_PATH} ({resized.width}x{resized.height})")


if __name__ == "__main__":
    main()
