#!/usr/bin/env python3
"""
Figma → public/images/person/personNN.jpg 書き出しスクリプト（角丸なし・フルブリード）

Person 一覧ページ (Figma node 978:2031 "05_person") の 15 枚の PersonCard
写真を、**角丸クロップしない**フラットな長方形 JPEG @2x（= 608×376px）として
書き出す。

なぜ単純レンダリングではダメか:
  各写真ノード "Mask group" (837:455X) は先頭child "Rectangle 2438" を
  角丸マスクに使っており、ノードをそのままレンダリングすると角が丸く欠けて
  しまう（四隅が白く透ける）。サイト側 CSS が border-radius を当てるため、
  素材は角丸なしのフラットな長方形であるべき。

手法（各カード 2 レンダリングを合成）:
  1. 写真ノード(837:455X) を PNG でレンダリング
     → 正規の合成結果（人物のマスク等は完全に正しい）。ただし四隅は透明。
  2. 背景レイヤー(child[1] "Mask group") を PNG でレンダリング
     → フルブリードのぼかし背景。四隅まで埋まっている。
  3. 背景の上に写真ノードを alpha 合成 → 四隅は背景で埋まりフラットになる。
  4. 写真ノードの absoluteBoundingBox(=304×188 のマスク矩形) で切り出し
     → 608×376 のフラットな長方形。JPEG 保存。

  画像本体は 1.（正規レンダリング）が 100% 担う。背景は四隅のぼかし部分を
  埋めるだけなので継ぎ目は実質生じない。

トークンの読み取り順（いずれか）:
    1. 環境変数 FIGMA_TOKEN / FIGMA_ACCESS_TOKEN
    2. プロジェクト直下 .env の FIGMA_ACCESS_TOKEN= / FIGMA_TOKEN=（gitignore済）
    3. プロジェクト直下 .figma_token（gitignore済）

使い方:
    python3 scripts/export_figma_persons.py          # 全 15 枚
    python3 scripts/export_figma_persons.py 8 13     # person 番号を指定（その枚のみ）
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path
from io import BytesIO

import numpy as np
from PIL import Image

FILE_KEY = "Q5PQirN5wGl9c1AqJJHZBt"
SCALE = 2
JPEG_QUALITY = 90

# person 番号（掲載順 = Figma 978:2031 のグリッド順）→ (写真ノード, 背景レイヤーノード child[1])
# Figma metadata (978:2031 "05_person") 解析で確定。各 PersonCard_NN 内の写真
# "Mask group" を見出しテキストで person.astro の people[] と突合してマッピング。
# ※ 旧 836:2220 から並び替えられ、写真ノード ID は同一のまま person スロットが
#    入れ替わっている（例: 837:4553 は旧 person1 → 現 person8、どちらも野村健人）。
NODES = {
    1:  ("837:4681", "837:4683"),  # 横山千穂  これはお母さんが作った製品だよ
    2:  ("837:4665", "837:4667"),  # 山本凌大  確かな土台の上で
    3:  ("837:4697", "837:4699"),  # 古田彰謙  挑戦できる環境で
    4:  ("837:4601", "837:4603"),  # 佐々琢磨  お客様の安心を、品質で支える。
    5:  ("837:4585", "837:4587"),  # 南潤哉    「食」を支える
    6:  ("837:4649", "837:4651"),  # 勝部葵    島根から世界へ
    7:  ("837:4745", "837:4747"),  # 武田大地  地元・島根に
    8:  ("837:4553", "837:4555"),  # 野村健人  地元で、世界で
    9:  ("837:4617", "837:4619"),  # 山根一眞  安定した会社で
    10: ("837:4569", "837:4571"),  # 加藤圭二  自分の仕事が
    11: ("837:4633", "837:4635"),  # 山羽紗由  この人たちと働きたい
    12: ("837:4713", "837:4715"),  # 東龍吾    海外市場のさらなる拡大
    13: ("837:4761", "837:4763"),  # 呉瑋芳    限界を決めない
    14: ("837:4777", "837:4779"),  # 冨江圭佑  人を支える仕事で
    15: ("837:4729", "837:4731"),  # 河村真由  語学を武器に
}

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "person"


def read_token() -> str | None:
    # 1) 環境変数（FIGMA_TOKEN / FIGMA_ACCESS_TOKEN）
    for var in ("FIGMA_TOKEN", "FIGMA_ACCESS_TOKEN"):
        tok = os.environ.get(var)
        if tok:
            return tok.strip()
    root = Path(__file__).resolve().parent.parent
    # 2) プロジェクト直下 .env の FIGMA_ACCESS_TOKEN / FIGMA_TOKEN（gitignore済）
    env = root / ".env"
    if env.exists():
        import re
        for line in env.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\s*(?:export\s+)?(FIGMA_ACCESS_TOKEN|FIGMA_TOKEN)\s*=\s*(.+)", line)
            if m:
                return m.group(2).strip().strip('"').strip("'")
    # 3) .figma_token ファイル（gitignore済）
    f = root / ".figma_token"
    if f.exists():
        return f.read_text(encoding="utf-8").strip()
    return None


def api_json(url: str, token: str) -> dict:
    req = urllib.request.Request(url, headers={"X-Figma-Token": token})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_bytes(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=180) as r:
        return r.read()


def get_bounds(token: str, ids: list[str]) -> dict:
    """各ノードの absoluteBoundingBox / absoluteRenderBounds を取得。"""
    out = {}
    # nodes エンドポイントは ids をまとめて受け付ける
    url = (
        f"https://api.figma.com/v1/files/{FILE_KEY}/nodes"
        f"?ids={','.join(ids)}&depth=1"
    )
    data = api_json(url, token)
    for nid, wrap in data.get("nodes", {}).items():
        doc = (wrap or {}).get("document", {})
        out[nid] = {
            "bbox": doc.get("absoluteBoundingBox"),
            "render": doc.get("absoluteRenderBounds") or doc.get("absoluteBoundingBox"),
        }
    return out


def render_pngs(token: str, ids: list[str], chunk: int = 8) -> dict:
    """ids を PNG@2x でレンダリングし {id: bytes} を返す（ids はチャンク分割）。"""
    images = {}
    for i in range(0, len(ids), chunk):
        part = ids[i:i + chunk]
        url = (
            f"https://api.figma.com/v1/images/{FILE_KEY}"
            f"?ids={','.join(part)}&scale={SCALE}&format=png"
        )
        try:
            data = api_json(url, token)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            raise RuntimeError(f"images {e.code} for {part}: {body}")
        if data.get("err"):
            raise RuntimeError(f"images err for {part}: {data['err']}")
        images.update(data.get("images", {}))
    out = {}
    for nid in ids:
        u = images.get(nid)
        if not u:
            raise RuntimeError(f"no render url for {nid}")
        out[nid] = fetch_bytes(u)
    return out


def pick_origin(img: Image.Image, bounds: dict) -> tuple[float, float]:
    """PNG の左上が対応する絶対座標 (x, y) を推定。
    render bounds と bbox のどちらが PNG サイズに一致するかで判定。"""
    pw = img.width / SCALE
    cands = []
    for key in ("render", "bbox"):
        b = bounds.get(key)
        if b:
            cands.append((abs(b["width"] - pw), b["x"], b["y"]))
    cands.sort()
    return cands[0][1], cands[0][2]


def crop_window(img: Image.Image, origin_xy, win) -> Image.Image:
    """絶対座標 win(x,y,w,h) の領域を img から切り出し（足りなければ透明パディング）。"""
    ox, oy = origin_xy
    left = round((win["x"] - ox) * SCALE)
    top = round((win["y"] - oy) * SCALE)
    w = round(win["width"] * SCALE)
    h = round(win["height"] * SCALE)
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    src = img.convert("RGBA")
    canvas.paste(src, (-left, -top))
    return canvas


def fill_transparent(rgba: Image.Image, thresh: int = 128) -> Image.Image:
    """残った透明ピクセル（被覆されなかった四隅など）を、最近傍の不透明
    ピクセルで埋める（横方向→縦方向のエッジ拡張）。背景はぼかしなので継ぎ目なし。"""
    arr = np.array(rgba)
    h, w, _ = arr.shape
    BIG = 1 << 30

    def gather_nearest(a, opaque, axis):
        n = a.shape[axis]
        idx_line = np.arange(n)
        shape = [1, 1]
        shape[axis] = n
        idx = idx_line.reshape(shape)
        idx_full = np.broadcast_to(idx, opaque.shape)
        fwd = np.where(opaque, idx_full, -1)
        fwd = np.maximum.accumulate(fwd, axis=axis)
        bwd = np.where(opaque, idx_full, n)
        bwd = np.flip(np.minimum.accumulate(np.flip(bwd, axis=axis), axis=axis), axis=axis)
        fdist = np.where(fwd >= 0, idx_full - fwd, BIG)
        bdist = np.where(bwd < n, bwd - idx_full, BIG)
        use_fwd = fdist <= bdist
        src = np.where(use_fwd, fwd, bwd)
        valid = (fdist < BIG) | (bdist < BIG)
        return np.clip(src, 0, n - 1), valid

    # 横方向
    opaque = arr[:, :, 3] >= thresh
    src_col, valid = gather_nearest(arr, opaque, axis=1)
    rows = np.arange(h)[:, None].repeat(w, axis=1)
    gathered = arr[rows, src_col]
    need = (~opaque) & valid
    arr[need] = gathered[need]
    arr[need, 3] = 255

    # 縦方向（横で埋まらなかった分）
    opaque = arr[:, :, 3] >= thresh
    if not opaque.all():
        src_row, valid = gather_nearest(arr, opaque, axis=0)
        cols = np.arange(w)[None, :].repeat(h, axis=0)
        gathered = arr[src_row, cols]
        need = (~opaque) & valid
        arr[need] = gathered[need]
        arr[need, 3] = 255

    return Image.fromarray(arr, "RGBA")


def main() -> int:
    token = read_token()
    if not token:
        print("ERROR: Figma トークン未検出。FIGMA_TOKEN か .figma_token を用意してください。",
              file=sys.stderr)
        return 2

    # 任意: 引数で person 番号を指定すると、その番号だけ書き出す（例: `... 8 13`）。
    # 無指定なら全 15 枚。一部のカードだけ Figma で差し替わった場合に使う。
    if len(sys.argv) > 1:
        try:
            want = sorted({int(a) for a in sys.argv[1:]})
        except ValueError:
            print(f"ERROR: person 番号は整数で指定してください: {sys.argv[1:]}", file=sys.stderr)
            return 2
        unknown = [n for n in want if n not in NODES]
        if unknown:
            print(f"ERROR: 未知の person 番号 {unknown}（指定可: 1〜15）", file=sys.stderr)
            return 2
        targets = {n: NODES[n] for n in want}
        print(f"対象: person {want}（指定された {len(want)} 枚のみ書き出し）")
    else:
        targets = dict(NODES)

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    photo_ids = [p for p, _ in targets.values()]
    bg_ids = [b for _, b in targets.values()]
    all_ids = photo_ids + bg_ids

    print(f"[1/3] bounds 取得 ({len(all_ids)} ノード) ...")
    try:
        bounds = get_bounds(token, all_ids)
    except urllib.error.HTTPError as e:
        print(f"ERROR: bounds {e.code}: {e.read().decode('utf-8','replace')}", file=sys.stderr)
        return 1

    print(f"[2/3] PNG@{SCALE}x レンダリング/取得 ({len(all_ids)} ノード) ...")
    try:
        pngs = render_pngs(token, all_ids)
    except (urllib.error.HTTPError, RuntimeError) as e:
        print(f"ERROR: render: {e}", file=sys.stderr)
        return 1

    print(f"[3/3] 合成 → 切り出し → JPEG 保存 → {OUT_DIR}")
    ok = 0
    for num in sorted(targets):
        photo_id, bg_id = targets[num]
        win = bounds[photo_id]["bbox"]  # 切り出し窓 = 角丸マスク矩形 (304×188)
        tw, th = round(win["width"] * SCALE), round(win["height"] * SCALE)

        photo_img = Image.open(BytesIO(pngs[photo_id]))
        bg_img = Image.open(BytesIO(pngs[bg_id]))

        photo_o = pick_origin(photo_img, bounds[photo_id])
        bg_o = pick_origin(bg_img, bounds[bg_id])

        photo_c = crop_window(photo_img, photo_o, win)
        bg_c = crop_window(bg_img, bg_o, win)

        # 透明バックストップに合成（被覆漏れは後段のエッジ拡張で埋める）
        canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        canvas.alpha_composite(bg_c)     # フルブリード背景（四隅を埋める）
        canvas.alpha_composite(photo_c)  # 正規の合成結果（人物含む）
        canvas = fill_transparent(canvas)  # 残った透明（角丸の四隅等）を埋める
        out = canvas.convert("RGB")

        dest = OUT_DIR / f"person{num:02d}.jpg"
        out.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=False)
        print(f"  person{num:02d}.jpg  ✓  {tw}x{th}  {dest.stat().st_size:,} bytes")
        ok += 1

    print(f"\n完了: {ok}/{len(targets)} 枚（角丸なし・フラット）を書き出しました。")
    return 0 if ok == len(targets) else 1


if __name__ == "__main__":
    raise SystemExit(main())
