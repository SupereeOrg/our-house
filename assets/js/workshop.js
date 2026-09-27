/* ============================================================
   工作间脚本 —— 项目清单（打字输出）
   站长们往 PROJECTS 里加条目即可
   ============================================================ */
(function () {
  "use strict";

  const PROJECTS = [
    { name: "shichuang-site", desc: "就是这座小屋本身", lang: "html/css", star: 2, url: "#" },
    { name: "eebot",          desc: "屎山再造计划",      lang: "js",      star: 1, url: "#" },
    { name: "建模作业",        desc: "交完就去玩原神",    lang: "blender", star: 3, url: "#" },
    { name: "more",           desc: "正在酝酿",           lang: "wip",     star: 0, url: "#" }
  ];

  const list = document.getElementById("termList");
  if (!list) return;

  PROJECTS.forEach((p, i) => {
    const a = document.createElement("a");
    a.className = "proj";
    a.href = p.url;
    a.style.animationDelay = (0.15 + i * 0.18) + "s";
    const stars = "★".repeat(p.star) + "☆".repeat(Math.max(0, 3 - p.star));
    a.innerHTML =
      '<span class="star">' + stars + '</span>'
      + '<span class="name">' + p.name + '<small># ' + p.desc + '</small></span>'
      + '<span class="lang">' + p.lang + '</span>';
    list.appendChild(a);
  });
})();
