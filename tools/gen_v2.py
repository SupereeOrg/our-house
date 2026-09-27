#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""拾窗 v2 · 素材批次：暖色主画 / 纸纹 / 白底小物件（供抠图加白边）"""
import subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
GEN = ROOT.parent / "draw.py"
OUT = ROOT.parent / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

SCENE = ("，吉卜力工作室背景美术风格，动画电影场景，手绘水彩质感，"
         "温暖治愈的暖色调，柔和光影，高质量，细节丰富，画面中没有人物，没有文字")
OBJ = ("，居中摆放，纯白色背景，无阴影，吉卜力动画美术风格道具设定，"
       "手绘水彩质感，温暖色调，高质量细节，画面中没有人物，没有文字")

JOBS = [
    ("hero_home", "scene",
     "童话故事插图，一栋温暖的独栋小屋坐落在开满绣球花的山丘上，多扇窗户透出橘黄色暖光，"
     "烟囱飘着袅袅炊烟，屋顶上睡着一只小小的三花猫，石板小路蜿蜒而上，路边几盏点亮的小灯笼，"
     "深橘金色黄昏晚霞天空，几颗初现的星星"),
    ("obj_books", "obj",
     "一摞三四本深红与墨绿封面的旧书，用米色麻绳捆着，最上面放着一副圆框眼镜和一枚干花书签"),
    ("obj_teacup", "obj",
     "一只青花瓷茶杯放在木质茶托上，杯中红茶冒着袅袅热气，旁边放着一块曲奇饼干"),
    ("obj_computer", "obj",
     "一台米黄色的复古家用小电脑，弧角屏幕上显示一个简单的像素笑脸，键盘上趴着一只黄色小铅笔"),
    ("obj_camera", "obj",
     "一台棕色皮质机身的复古胶片相机，皮质背带自然垂落，旁边放着一小卷胶片"),
    ("obj_musicbox", "obj",
     "一只打开的黄铜发条音乐盒，盒内旋转小舞台上立着一只跳舞的小猫摆件，旁边散落几个音符形小饰件"),
    ("obj_postcards", "obj",
     "一叠用麻绳捆扎的旧明信片，旁边散落着两枚花卉邮票和一张老车票"),
    ("obj_film", "obj",
     "一盘深棕色的老式电影胶片卷盘，散出几格胶片带，旁边放着一枚红色火漆印"),
    ("obj_letter", "obj",
     "一封盖着红色火漆封印的米色信封，火漆印上是猫爪图案，旁边横放着一支蘸水钢笔"),
    ("obj_cat", "obj",
     "一只三花猫蜷成一团熟睡，尾巴环抱着身体，趴在一块蓝白拼布小垫上"),
    ("obj_plant", "obj",
     "一只赤陶花盆里长着一丛茂盛的绿萝，垂下几条藤蔓，盆边放着一个迷你洒水壶"),
    ("obj_lamp", "obj",
     "一盏点亮的小型黄铜煤油灯，玻璃灯罩里透出温暖的橙色光芒，旁边放着一盒火柴"),
    ("paper_tex", "texture",
     "手工水彩纸纹理特写，温暖的奶油米色，极其细腻的纸张纤维与微小水彩颗粒，均匀柔和，几乎纯色"),
]

def run(name, kind, prompt):
    save = OUT / f"{name}.png"
    if save.exists() and save.stat().st_size > 20000:
        print(f"[skip] {name}")
        return
    suffix = OBJ if kind == "obj" else SCENE
    full = prompt + suffix
    for attempt in (1, 2, 3):
        print(f"[gen ] {name} #{attempt}", flush=True)
        try:
            subprocess.run([sys.executable, str(GEN), "-f", f"{name}.png", "-d", str(OUT), "-p", full],
                           capture_output=True, text=True, encoding="utf-8",
                           errors="replace", timeout=150)
        except subprocess.TimeoutExpired:
            print(f"[fail] {name} timeout", flush=True)
            continue
        if save.exists() and save.stat().st_size > 20000:
            print(f"[ ok ] {name} {save.stat().st_size}", flush=True)
            return
        time.sleep(4)
    print(f"[FAIL-FINAL] {name}", flush=True)

if __name__ == "__main__":
    targets = sys.argv[1:]
    for name, kind, prompt in JOBS:
        if targets and name not in targets:
            continue
        run(name, kind, prompt)
    print("全部完成")
