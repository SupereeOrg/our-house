/* ============================================================
   拾窗 · 主页脚本 v2 —— 题字独白
   ============================================================ */
(function () {
  "use strict";

  const LINES = [
    "一个在高原看云，一个在南方淋雨，小屋盖在中间，住着 su 和 ee。",
    "窗子一扇一扇亮着灯，等你来挑。"
  ];
  const lineEl = document.getElementById("heroLine");
  const hintEl = document.getElementById("heroHint");
  if (!lineEl) return;

  let li = 0, ci = 0;
  function type() {
    if (li >= LINES.length) {
      if (hintEl) hintEl.classList.add("show");
      return;
    }
    const text = LINES[li];
    if (ci <= text.length) {
      lineEl.textContent = text.slice(0, ci);
      ci++;
      setTimeout(type, 95);
    } else {
      setTimeout(() => { li++; ci = 0; type(); }, 2400);
    }
  }
  type();
})();
