/* ============================================================
   慢读室脚本 —— 文稿数据与切换
   站长们往 ESSAYS 里加条目即可：书架自动长出新书
   ============================================================ */
(function () {
  "use strict";

  const ESSAYS = [
    {
      title: "慢读室开卷语",
      meta: "su & ee · 2026-09-15 · 约需一盏茶",
      path: "今天读点慢的",
      paras: [
        "这里放着我们写得比较慢、比较长的字。它们不适合在地铁上读，不适合排队的时候读，只适合一个安静的下午——最好下着雨，窗户上有水珠往下滑。",
        "慢读室的名字是这么来的：有些字值得慢一点读，就像有些路值得慢一点走。我们不做信息流的搬运工，这里一篇文章就是一篇文章，读完一篇，再去书架上抽下一本。",
        "如果你读到某一篇，恰好也想起自己的某个下午，那就再好不过了。"
      ]
    },
    {
      title: "山中的信（待填）",
      meta: "ee · 敬请期待 · 约需一个黄昏",
      path: "山里的信 · 还没写完",
      paras: [
        "这一本还没有写完。ee 说，等广州的木棉红了，信就写好了。",
        "书架先给它留了一个位置，书脊也包好了，就等信来。"
      ]
    },
    {
      title: "待写的故事",
      meta: "su · 构思中 · 约需一个周末",
      path: "抽屉里的开头们",
      paras: [
        "su 的抽屉里有很多开头：一句没头没尾的对话、一段梦境的记录、一张写了一半的卡片。梦到哪句，就记哪句。",
        "在长成之前，它们先在书架上安静地睡着。"
      ]
    }
  ];

  const shelf = document.getElementById("shelf");
  const body = document.getElementById("readerBody");
  const pathEl = document.getElementById("readerPath");
  const metaEl = document.getElementById("readerMeta");
  if (!shelf || !body) return;

  // 生成书脊（保持 HTML 里已写死的三本 + 数据里的）
  const existing = Array.from(shelf.querySelectorAll(".book"));
  ESSAYS.forEach((es, i) => {
    let a = existing[i];
    if (!a) {
      a = document.createElement("a");
      a.className = "book " + ["b-pine", "b-rust", "b-amber"][i % 3];
      a.innerHTML = '<span class="spine-title"></span>';
      shelf.insertBefore(a, shelf.querySelector(".shelf-shelfline"));
    }
    a.href = "#essay-" + i;
    a.dataset.idx = i;
    a.querySelector(".spine-title").textContent = es.title;
  });

  function render(idx) {
    const es = ESSAYS[idx];
    if (!es) return;
    body.innerHTML =
      '<article class="essay">'
      + '<h2>' + es.title + '</h2>'
      + '<div class="essay-meta">' + es.meta + '</div>'
      + es.paras.map(p => '<p>' + p + '</p>').join("")
      + '<div class="essay-end">❧ 本篇终 ❧</div>'
      + '</article>';
    if (pathEl) pathEl.textContent = es.path;
    if (metaEl) metaEl.textContent = " " + (idx + 1) + "/" + ESSAYS.length + " ";
    Array.from(shelf.querySelectorAll(".book")).forEach(b =>
      b.classList.toggle("active", b.dataset.idx == idx));
    body.scrollTop = 0;
  }

  shelf.addEventListener("click", (e) => {
    const a = e.target.closest(".book");
    if (!a) return;
    e.preventDefault();
    render(+a.dataset.idx);
  });

  render(0);
})();
