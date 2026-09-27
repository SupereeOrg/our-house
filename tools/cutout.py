#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cutout.py —— 白底物件图 → 透明背景 + 厚暖白描边装饰件
用法: python cutout.py obj_books obj_teacup ...   (无参数则处理全部 obj_*)
原理: 从四边泛洪填充标记"与边界相连的近白区域"为背景（保留物体内部的浅色），
     裁切 bbox → 缩放 → 最大值滤波膨胀 alpha 生成厚白边 → 合成。
"""
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
OUT = IMG / "deco"
OUT.mkdir(exist_ok=True)

NEAR_WHITE = 232      # min(rgb) 高于此视为候选背景
TARGET = 360          # 输出最长边
STROKE = 16           # 描边厚度（缩放后像素）
STROKE_COLOR = (255, 253, 247, 255)  # 暖纸白


def border_flood_bg(mask):
    """mask=True 表示近白。返回与图像边界连通的背景 mask。"""
    h, w = mask.shape
    bg = np.zeros_like(mask, dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if mask[y, x] and not bg[y, x]:
                bg[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if mask[y, x] and not bg[y, x]:
                bg[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny, nx = y+dy, x+dx
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True
                q.append((ny, nx))
    return bg


def cutout(path: Path):
    im = Image.open(path).convert("RGB")
    a = np.array(im)
    mn = a.min(axis=-1).astype(np.int16)
    near_white = mn >= NEAR_WHITE
    bg = border_flood_bg(near_white)
    alpha = np.where(bg, 0, 255).astype(np.uint8)

    rgba = np.dstack([a, alpha])
    out = Image.fromarray(rgba, "RGBA")

    # 裁切到内容 bbox
    bbox = out.getchannel("A").getbbox()
    if not bbox:
        print(f"[skip] {path.name} 无内容")
        return
    out = out.crop(bbox)

    # 缩放
    w, h = out.size
    scale = TARGET / max(w, h)
    if scale < 1:
        out = out.resize((round(w*scale), round(h*scale)), Image.LANCZOS)

    # 厚白描边：膨胀 alpha
    amask = out.getchannel("A")
    k = STROKE * 2 + 1
    big = amask.filter(ImageFilter.MaxFilter(k))
    big = big.filter(ImageFilter.GaussianBlur(0.8))
    stroke = Image.new("RGBA", out.size, STROKE_COLOR[:3] + (0,))
    white = Image.new("RGBA", out.size, STROKE_COLOR)
    stroke.paste(white, mask=big)
    final = Image.alpha_composite(stroke, out)

    dest = OUT / path.name
    final.save(dest)
    print(f"[ ok ] {path.name} -> deco/ ({final.size[0]}x{final.size[1]})")


if __name__ == "__main__":
    names = sys.argv[1:] or sorted(p.name for p in IMG.glob("obj_*.png"))
    for n in names:
        p = IMG / n if n.endswith(".png") else IMG / (n + ".png")
        if p.exists():
            cutout(p)
        else:
            print(f"[miss] {p.name}")
