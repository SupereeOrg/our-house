/* ============================================================
   八音盒脚本 —— 曲目与唱机联动
   站长们往 TRACKS 里加歌：title/artist/why 换成自己的
   ============================================================ */
(function () {
  "use strict";

  const TRACKS = [
    { title: "夜に駆ける", artist: "YOASOBI · 高二那年的循环", why: "su 的日语歌启蒙期，一整个青春期的背景音。", stem: "A面 · 1" },
    { title: "纯音乐考古特辑", artist: "初中歌单 · 网易云出土", why: "su：听纯音乐学习效率更高，不听就想刷短视频。", stem: "A面 · 2" },
    { title: "英文歌随机合集", artist: "su 歌单 · 已获 ee 认证", why: "ee 听完盖章：su 歌单里的英文歌还挺好听的。", stem: "B面 · 1" },
    { title: "一起听 · 挂机纪念版", artist: "汽水音乐 · 连挂三天", why: "一起听就这样挂了三天，谁也没舍得先退出。", stem: "B面 · 2" }
  ];

  const box = document.getElementById("sleeves");
  const disc = document.getElementById("disc");
  const arm = document.getElementById("tonearm");
  const tip = document.getElementById("gramoTip");
  if (!box) return;

  TRACKS.forEach((t, i) => {
    const el = document.createElement("div");
    el.className = "sleeve";
    el.innerHTML =
      '<span class="mini-disc"></span>'
      + '<span class="s-meta">'
      +   '<span class="s-title">' + t.title + '</span>'
      +   '<span class="s-artist">' + t.artist + '</span>'
      +   '<span class="s-why">' + t.why + '</span>'
      + '</span>'
      + '<span class="s-stem">' + t.stem + '</span>';
    el.addEventListener("click", () => play(el, t));
    box.appendChild(el);
  });

  function play(el, t) {
    const wasPlaying = el.classList.contains("playing");
    box.querySelectorAll(".sleeve").forEach(s => s.classList.remove("playing"));
    if (wasPlaying) {          // 再点一次 = 抬起唱臂
      disc.classList.remove("playing");
      arm.classList.remove("playing");
      tip.textContent = "把唱片放上去（点击任意一首）";
      return;
    }
    el.classList.add("playing");
    disc.classList.add("playing");
    arm.classList.add("playing");
    tip.textContent = "正在转：『" + t.title + "』 — 再点一次可停下";
  }
})();
