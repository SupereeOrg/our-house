/* ============================================================
   放映室脚本 —— 片单与银幕联动
   站长们往 FILMS 里加视频：把 url 换成视频/嵌入地址即可
   ============================================================ */
(function () {
  "use strict";

  const FILMS = [
    {
      title: "雪域高原日常",
      desc: "su 的取景地：拉萨的蓝天低得像在头顶，云看多了都说很高。",
      no: "№ 01", stub: "ROW 5 · SEAT 7", url: "", from: "su"
    },
    {
      title: "广东雨天纪实",
      desc: "ee 说：红色暴雨停课时，雨后的校园感觉很破烂（好评）。",
      no: "№ 02", stub: "ROW 3 · SEAT 12", url: "", from: "ee"
    },
    {
      title: "su 的高效小睡一日",
      desc: "20 分钟高效小睡开启一天，之后是霸气回笼觉。献给所有睡不着的人。",
      no: "№ 03", stub: "ROW 1 · SEAT 3", url: "", from: "su & ee"
    }
  ];

  const box = document.getElementById("tickets");
  const body = document.getElementById("screenBody");
  const title = document.getElementById("screenTitle");
  if (!box) return;

  FILMS.forEach((f, i) => {
    const el = document.createElement("div");
    el.className = "ticket";
    el.innerHTML =
      '<span class="t-no">' + f.no + '</span>'
      + '<span class="t-main">'
      +   '<span class="t-title">' + f.title + '</span>'
      +   '<div class="t-desc">' + f.desc + ' —— <i>' + f.from + '</i> 藏</div>'
      + '</span>'
      + '<span class="t-stub">' + f.stub + '</span>';
    el.addEventListener("click", () => play(el, f));
    box.appendChild(el);
  });

  function play(el, f) {
    box.querySelectorAll(".ticket").forEach(t => t.classList.remove("active"));
    el.classList.add("active");
    title.textContent = "now playing — " + f.title;
    if (f.url) {
      // 站长填入视频地址后自动生效
      if (/\.(mp4|webm)$/i.test(f.url)) {
        body.innerHTML = '<p class="v-title">◙ ' + f.title + '</p>'
          + '<video src="' + f.url + '" controls autoplay playsinline></video>';
      } else {
        body.innerHTML = '<p class="v-title">◙ ' + f.title + '</p>'
          + '<iframe src="' + f.url + '" allowfullscreen allow="autoplay; fullscreen"></iframe>';
      }
    } else {
      body.innerHTML =
        '<p class="screen-idle">▞ 胶片运送中 ▚</p>'
        + '<p class="screen-idle-sub">「' + f.title + '」的拷贝还没有寄到小屋，'
        + '到了就马上开机</p>';
    }
  }
})();
