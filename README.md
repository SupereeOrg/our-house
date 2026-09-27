# 拾窗 · su & ee 的双人小屋

一座静态小站：山丘上的一栋小屋，八个房间，一只猫。

## 本地预览

直接双击 `index.html` 即可；或起一个本地服务器（推荐，地址栏更干净）：

    python -m http.server 8000
    # 浏览器打开 http://localhost:8000

## 房间一览

| 页面          | 房间     | 内容     | 排版特色              |
| ------------- | -------- | -------- | --------------------- |
| index.html    | 屋顶     | 主页入口 | 小屋+八扇窗，夜里亮灯 |
| library.html  | 慢读室   | 长文     | 书脊书架 + 稿纸阅读窗 |
| whispers.html | 檐下碎语 | 碎碎念   | 三列便签墙 + 摇摆风铃 |
| workshop.html | 工作间   | 技术作品 | 终端窗口 ls 输出      |
| misc.html     | 拾遗集   | 其他作品 | 桌面错落卡片          |
| music.html    | 八音盒   | 收藏音乐 | 唱机转盘 + 唱片套     |
| gallery.html  | 明信片墙 | 收藏图片 | 挂绳 + 图钉宝丽来     |
| cinema.html   | 放映室   | 收藏视频 | 银幕 + 电影票         |
| about.html    | 关于小屋 | 站长介绍 | 双人卡片 + 信箱       |
| cat.html      | 猫威见   | 404 页   | 猫叫你回去            |

## 更新内容

所有内容都用「改 JS 数组 / 改 HTML」的方式维护，不需要构建工具：

- **长文**：`assets/js/library.js` 里的 `ESSAYS` 数组。加一个条目，
  书架上会自动多出一本书（书脊颜色三色循环）。
- **碎碎念**：直接复制 `whispers.html` 里的一段 `<article class="slip">`，
  改文字即可；`clip-pine` / `clip-rust` 是两种胶带颜色。
- **技术作品**：`assets/js/workshop.js` 里的 `PROJECTS` 数组，
  `url` 填仓库或文章链接。
- **音乐**：`assets/js/music.js` 里的 `TRACKS` 数组。`why` 字段写上
  「推荐理由」，这是这张歌单的灵魂。
- **视频**：`assets/js/cinema.js` 里的 `FILMS` 数组。`url` 支持
  mp4/webm 直链或任意 iframe 嵌入（B站、YouTube 的分享地址均可）；
  留空则显示「胶片运送中」。
- **图片**：往 `gallery.html` 的某根 `.rope` 里加一张
  `<figure class="card">`，图片丢进 `assets/img/`。

## 设计规范

- 字体：正文宋体系（Noto Serif SC → 宋体栈），标题/点缀楷体（--kai），代码等宽字
- 色板：暖纸 #fbf4e6、墨褐 #4a3a2c、焦糖 #8a5a3b、琥珀 #d49a3c、陶土 #c06a45
- 主页：一幅黄昏小屋插画（hero_home.png）+ 9 个定位热区（坐标在 index.html 的 --x/--y），
  楼下桌面是白描边贴纸目录（deco/\*.png，由 cutout.py 从 obj\*\*.png 抠出）
- 内容不铺满：全部窗口式浮在留白上（.paper-window）
- 夜间模式：右下角夜灯按钮；19 点后自动开启，也可手动

## 素材生成

    # 主画/贴纸原图/纸纹（API key 应该写入 .env）
    python tools/gen_v2.py            # 全部，或指定名字
    # 抠图 + 厚白描边（obj_* → deco/）
    python tools/cutout.py

零依赖、零构建、离线可用（贴纸抠图需要 Pillow + numpy）。
