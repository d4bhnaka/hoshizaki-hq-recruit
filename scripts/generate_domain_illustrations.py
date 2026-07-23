"""strategy 事業領域図の5ノードイラストを GPT Image で再生成する。

トンマナ: 大人っぽい・シンプル・スタイリッシュ(顔なしフラットベクター)。
グループごとに個別生成し、共通スタイル前文(STYLE)で統一する。
生成後は低アルファのヘイズ除去→トリム→高さ400pxに正規化して
public/images/strategy/domain-*.png を上書きし、実寸を出力する。
実寸が変わったら src/pages/strategy.astro の domains[].w/h を更新すること。

必要: .env の OPENAI_API_KEY、Pillow。実行: python3 scripts/generate_domain_illustrations.py
"""

import base64
import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public/images/strategy")
SCRATCH = os.path.join(ROOT, "scripts", "_domain_raw")
os.makedirs(SCRATCH, exist_ok=True)

API_KEY = None
with open(os.path.join(ROOT, ".env")) as f:
    for line in f:
        if line.startswith("OPENAI_API_KEY="):
            API_KEY = line.split("=", 1)[1].strip()
if not API_KEY:
    sys.exit("no key")

STYLE = """Minimal flat vector illustration asset, isolated on a 100% transparent \
background. Absolutely NO background elements, NO glow, NO halo, NO soft light, NO \
shadow, NO floor, NO backdrop — only the figure(s), crisp clean cutout edges like an \
SVG sticker.

Style: sophisticated, restrained corporate illustration for a Japanese recruiting \
website. Elegant and mature, NOT cute, NOT childish, NOT chibi, NOT anime. Slim \
realistic adult proportions, about 7 heads tall, standing upright, full body from head \
to shoes, entirely inside the frame with margins on all sides. Completely faceless: no \
eyes, no mouth, no nose. Simplified geometric shapes, solid matte flat colors, no \
outlines, no gradients, no shading, no texture. Skin: single neutral beige. Hair: \
single dark ink color #2b3a42. Neutral garments: desaturated navy, slate gray, \
off-white. Exactly one accent color used sparingly.

Subject: """

GROUPS = [
    (
        "domain-medical.png",
        "TWO people side by side — a male doctor in a long white coat with a "
        "stethoscope around his neck, and a female nurse in medical scrubs. "
        "Accent color: cyan blue #00a0e9 for the nurse's scrubs.",
    ),
    (
        "domain-restaurant.png",
        "ONE chef in a white double-breasted chef jacket and tall white toque hat, "
        "holding a black frying pan in one hand. "
        "Accent color: terracotta #ef7d5e for the waist apron.",
    ),
    (
        "domain-school-office.png",
        "ONE female cafeteria staff member wearing a white hygiene cap and holding a "
        "serving tray with both hands. "
        "Accent color: amber yellow #f2b134 for the long apron.",
    ),
    (
        "domain-retail.png",
        "ONE convenience-store clerk wearing a shirt and a bib apron, holding a "
        "shopping basket in front. "
        "Accent color: green #3bb98a for the apron.",
    ),
    (
        "domain-agri-fishery.png",
        "TWO people side by side — a farmer with a wide-brim straw hat holding a "
        "wooden crate of vegetables, and a fisherman in bib overalls and rubber boots "
        "holding one large fish. "
        "Accent color: muted violet #7b83e0 for the fisherman's overalls.",
    ),
]


def generate(name: str, subject: str) -> tuple[str, int, int]:
    two = subject.startswith("TWO")
    body = json.dumps(
        {
            "model": "gpt-image-1",
            "prompt": STYLE + subject,
            "size": "1024x1536" if not two else "1024x1024",
            "quality": "high",
            "background": "transparent",
            "output_format": "png",
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
        data = json.load(res)
    raw = base64.b64decode(data["data"][0]["b64_json"])
    p = os.path.join(SCRATCH, "raw_" + name)
    with open(p, "wb") as f:
        f.write(raw)

    img = Image.open(p).convert("RGBA")
    # うっすら残るヘイズ対策: 低アルファを完全透過に落とす
    r, g, b, a = img.split()
    a = a.point(lambda v: 0 if v < 48 else v)
    img = Image.merge("RGBA", (r, g, b, a))
    bbox = img.getbbox()
    img = img.crop(bbox)
    scale = 400 / img.height
    img = img.resize((round(img.width * scale), 400), Image.LANCZOS)
    img.save(os.path.join(OUT_DIR, name))
    return name, img.width, img.height


def main() -> None:
    with ThreadPoolExecutor(5) as ex:
        results = list(ex.map(lambda g: generate(*g), GROUPS))
    for name, w, h in results:
        print(f"{name}: {w}x{h}")
    with open(os.path.join(SCRATCH, "dims.json"), "w") as f:
        json.dump(results, f)


if __name__ == "__main__":
    main()
