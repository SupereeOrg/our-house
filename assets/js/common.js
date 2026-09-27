/* ============================================================
   拾窗 · 全站脚本 —— 夜灯、猫爪轨迹、页脚
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 夜间模式（按当地时刻 + 记忆） ---------- */
  const saved = localStorage.getItem("shichuang-night");
  const hour = new Date().getHours();
  if (saved === "1" || (saved === null && (hour >= 19 || hour < 6))) {
    document.body.classList.add("night");
  }
  // 夜灯按钮在 DOM 就绪后绑定
  function bindNightToggle() {
    const btn = document.querySelector(".night-toggle");
    if (!btn) return;
    const sync = () => {
      btn.textContent = document.body.classList.contains("night") ? "✩" : "☽";
    };
    sync();
    btn.addEventListener("click", () => {
      const on = document.body.classList.toggle("night");
      localStorage.setItem("shichuang-night", on ? "1" : "0");
      sync();
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindNightToggle);
  } else { bindNightToggle(); }

  /* ---------- 猫爪轨迹（隐藏彩蛋：不再常驻跟随） ---------- */
  // 原鼠标跟随爪印特效已按需求移除。

  /* ---------- 页脚 ---------- */
  function addFooter() {
    if (document.querySelector(".site-footer")) return;
    const f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML =
      '<div class="f-motto">山静似太古 · 日长如小年</div>'
      + '<div class="f-line"><span>© 2026 拾窗 · su &amp; ee</span>'
      + '<span>✳</span><span>handcrafted with patience</span></div>';
    document.body.appendChild(f);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addFooter);
  } else { addFooter(); }
})();
