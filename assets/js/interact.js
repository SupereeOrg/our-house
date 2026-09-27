/* ============================================================
   拾窗 · 小互动脚本 v2 —— 站内点缀小物件 / 封图热区 / 纸条墙
   语料来自 ee 与 su 的画像：短句、括号、小声 bb
   ============================================================ */
(function () {
  "use strict";

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* 在 element 附近冒一句气泡（element 的 offsetParent 需有定位）。
     全站共用同一个气泡：再次点击只换文字、挪位置，不再叠出新气泡 */
  let speechBubble = null;
  function say(el, text, ms) {
    if (!text) return;
    const host = el.offsetParent || document.body;
    if (!speechBubble || !speechBubble.isConnected || speechBubble.parentElement !== host) {
      speechBubble = document.createElement("div");
      speechBubble.className = "sprite-speech";
      host.appendChild(speechBubble);
    }
    const b = speechBubble;
    const er = el.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const left = er.left - hr.left + er.width / 2;
    b.style.left = Math.min(Math.max(left, 96), Math.max(hr.width - 96, 96)) + "px";
    b.style.bottom = (hr.height - (er.top - hr.top) + 10) + "px";
    b.textContent = text;
    requestAnimationFrame(() => b.classList.add("show"));
    clearTimeout(b._t);
    b._t = setTimeout(() => {
      b.classList.remove("show");
      /* 淡出期间若被复用（重新 show），就不移除 */
      setTimeout(() => { if (!b.classList.contains("show")) b.remove(); }, 400);
    }, ms || 3000);
  }

  function bindOnce(el, fn) {
    if (!el || el.dataset.bound) return;
    el.dataset.bound = "1";
    el.addEventListener("click", fn);
  }

  function wiggle(el) {
    el.classList.remove("wiggle");
    void el.offsetWidth;
    el.classList.add("wiggle");
  }

  /* ============================================================
     封图热区数据：key = 页面文件名
     坐标为封图百分比（左上原点）
     ============================================================ */
  const FRAME_SPOTS = {
    "library.html": [
      { x: 75, y: 54, w: 14, h: 12, tip: "窗台上的猫", lines: [
        "全屋作息最标准的就是它：天一黑就睡，不像某两个人。（小声）",
        "灰白花纹，坐姿标准，是一只看了很多场雨的猫。",
        "数雨数到两百零一就睡着了——比等 23 点的消息轻松多了。",
        "有人想把它画成绿色的猫娘，它表示可以考虑。",
        "窗外下雨，猫心里放晴——它想的是晚上的饭。" ] },
      { x: 25, y: 5, w: 17, h: 9, tip: "最高的那排书", lines: [
        "书按『下次还想重读』排的序，所以永远排不完。",
        "最高的那排放的全是重读了很多遍的——梯子只是个借口。",
        "分类法抄自一位歌单收藏家：36 个歌单对应 36 排书架。（ee）",
        "本屋居民在这儿塞过一本科幻，书名保密（还没写完）。",
        "有一本是两人合著的：一章在拉萨写，一章在广州写。" ] },
      { x: 35, y: 68, w: 23, h: 10, tip: "扶手椅", lines: [
        "椅子是『读完一页才能走』的专用座。",
        "盖毯晒过太阳，雨天闻起来味道最好。",
        "坐上来的人常常三分钟就摸出手机，然后聊到凌晨两点。",
        "它见证过「吃完早饭接着睡」的全套回笼流程，并帮忙保密。（ee）",
        "它最喜欢的故事是有人读到一半睡着。" ] },
      { x: 44.5, y: 45, w: 9, h: 21, tip: "木梯子", lines: [
        "梯子最高一级的用途：看一眼窗外的雨。",
        "它靠在书架上的第三年，依然是全屋最稳的家具。",
        "有人爬到一半看了眼表：快十一点了，听歌去了。",
        "本来是够书用的，现在主要用来挂心情。",
        "梯子说：那个十一月的承诺，我替你记着。" ] },
      { x: 5, y: 59, w: 10, h: 18, tip: "小木桌的台灯", lines: [
        "灯罩里存着整个下午的黄色。",
        "开灯的仪式感：先搓一下手。",
        "它的营业高峰在夜里十一点后——和某位住民的作息完全同步。",
        "灯下的小花是有人随手插的，一直没舍得换水（也没水可换）。",
        "它照亮过很多句子，最亮的那句是『回来啦』。" ] },
      { x: 70, y: 66, w: 20, h: 9, tip: "飘窗的软垫", lines: [
        "蓝垫子的用法一：盘腿。用法二：整个人。",
        "软垫记性很好，记得每个人的窝法。",
        "它托过一双盘腿打王者的腿——一局，哦不，一晚上。（su）",
        "坐垫凹下去的形状，是这屋子里最诚实的日记。",
        "窗下这个位置，是给『还差一点点』的阅读进度留的。" ] },
      { x: 63, y: 87, w: 22, h: 11, tip: "地毯上摊开的书", lines: [
        "摊开的书是留给这本书的尊重。",
        "有人翻到这一页去泡茶了，三小时了。",
        "地上的书不着急，地上的书有的是耐心。",
        "书页间夹着一小片茶叶，是本屋的天然书签。（ee）",
        "捡起来之前，请先在心里说声失陪。" ] },
      { x: 86, y: 79.5, w: 11, h: 13, tip: "角落的藤篮", lines: [
        "篮子说：还没排上队的书，先在我这儿住。",
        "藤条的编织密度与藏书量的平方成正比。",
        "它一直装作很空的样子。",
        "角落里最没有脾气的位置，专收读到一半的书。",
        "篮底压着一张书签，上面写：大结局明天再写。" ] }
    ],
    "whispers.html": [
      { x: 76, y: 28, w: 17, h: 15, tip: "玻璃上的雨", lines: [
        "第七滴追上第六滴的时候，茶刚好凉。",
        "雨在玻璃上画画，落款是今天。",
        "雨点排队往下走，像 23 点准时上线的消息，一条接一条。",
        "比赛选手一号已出发，预计三小时后抵达窗台底部。",
        "高原上难得见一场这样的雨，有位住民看入了迷。（su）" ] },
      { x: 35, y: 56, w: 31, h: 15, tip: "窗垫上的猫", lines: [
        "它睡在所有人的碎碎念上，睡得最沉。",
        "猫：这些小心情，本喵先替你们收好。",
        "碎碎念念到第七条，猫换了个睡姿表示已阅。",
        "它负责情绪质检，不合格的碎碎念会被舔平。",
        "（猫猫收不到消息，但猫猫在听）" ] },
      { x: 63, y: 68, w: 16, h: 17, tip: "热茶", lines: [
        "茶还烫，话还长，檐下不赶时间。",
        "先喝茶，再碎碎念，顺序不能乱。",
        "第四泡了，还是淡的——这是正经的养生茶。（su）",
        "ee 的行李箱一半是茶。这杯是家里塞来的，喝一口等于回趟家。",
        "今日配额：三大杯，共 1500ml。本杯正在认真工作。（ee）" ] },
      { x: 72, y: 81, w: 24, h: 12, tip: "圆框眼镜", lines: [
        "眼镜躺下了，说明主人决定先看完这场雨。",
        "它比谁都清楚：最近的字都是眯着眼看完的。",
        "镜片上有一小片雨的反光，算是加班。",
        "有位住民已换成隐形眼镜，放话寒假去做全飞秒。（su）",
        "不戴眼镜的世界自带柔光，雨天正合适。" ] },
      { x: 94, y: 46, w: 12, h: 22, tip: "白花和花瓶", lines: [
        "白花不知道自己是配菜的，开得很认真。",
        "花是从院子里现剪的，属于这间屋子唯一的骄傲。",
        "瓶里的水三天一换，是全屋最勤的值日——浇水那两位好好学学。",
        "花开得越白，越衬得窗外的雨发蓝。",
        "它在这儿负责把雨天过成节日。" ] },
      { x: 31, y: 46, w: 24, h: 11, tip: "蓝色的抱枕", lines: [
        "枕头的职务：下午四点后接住整个上半身——含回笼午睡。（ee）",
        "它的花纹和猫的毯子是一套的，全屋官配。",
        "抱枕塌下去一块，是常客的形状。",
        "别人家的枕头软，这个枕头懂事。",
        "它见过所有没发出去的长消息。后来都删了，重打成六个字的短句。" ] },
      { x: 19, y: 7, w: 9, h: 10, tip: "屋里的吊灯", lines: [
        "吊灯把光调到最柔——雨天的规格。",
        "它照着这条走廊，走廊照着往里走的路。",
        "灯亮着，就是在等夜猫子回来——凌晨两点也有灯。",
        "开一盏灯的功夫，雨大了一格。",
        "灯：我不生产光，我只是雨的暖色滤镜。" ] },
      { x: 21, y: 31, w: 13, h: 16, tip: "墙角的大绿植", lines: [
        "绿植什么都听见了，包括不该听的。",
        "它的叶子朝着窗歪，是懂行的。",
        "它雨天的产出：悄悄长半厘米，比某些写一半的仓库稳定。（su）",
        "这盆绿植被浇水的频率，约等于便签墙被更新的频率。",
        "叶子上落了一点窗缝里飘进来的雨，它当收据。" ] }
    ],
    "workshop.html": [
      { x: 41, y: 36.5, w: 26, h: 19, tip: "亮着的屏幕", lines: [
        "屏幕上的代码跑不通，但看起来很努力。",
        "这块屏跑过一版 eebot，屎山至今还在往上盖。",
        "左边的屏在写代码，右边的屏到点就切歌单——十一点的规矩。",
        "屏幕常亮的时长，约等于深夜聊天记录的长度。",
        "熄屏的一瞬间映出一张脸——凌晨三点，说好的必睡。（su）" ] },
      { x: 89, y: 60.5, w: 11, h: 12, tip: "桌角的茶杯", lines: [
        "工作间的茶：凉得比灵感还快。",
        "杯身上贴着便利贴：喝完这杯就去睡。（已过期）",
        "龙猫图案的杯子，装的都是纯黑咖啡——喝了照样困。（su）",
        "杯子的原话：我不是凉了，我在给咖啡因留面子。",
        "这是今天的第四杯。前三杯都忘了喝。（ee 的三杯茶配额又超了）" ] },
      { x: 93, y: 32, w: 14, h: 22, tip: "墙上的工具", lines: [
        "螺丝刀各就各位，就差一个想清楚的方案。",
        "工具墙上最闲的是锤子，最忙的是橡皮。",
        "每把工具都记得 306 实验室的型号，别问怎么记得的。（su）",
        "洞洞板的格言：一切东西都得有回墙上的路。",
        "挂回去的工具带着轻微的得意：今天也修好了一个 bug。" ] },
      { x: 55, y: 61, w: 17, h: 10, tip: "桌上的电路板", lines: [
        "这块板子今晚想变成机器人，先让它睡一觉。",
        "焊点排队站好，像一行没写完的诗。",
        "它昨晚想了一夜为什么 0 和 1 只有两个朋友。",
        "板子的梦想清单：第一行是『跑起来』，第二行是『跑起来别停』。",
        "它也想像隔壁那个机器人一样，从 1.x 更新到 4.x。（eebot 加油）" ] },
      { x: 75, y: 56, w: 16, h: 16, tip: "焊台与烙铁", lines: [
        "焊台的规矩：先热身三分钟，谁也别催。",
        "锡丝拉出一道银线，就当是给电路签个名。",
        "松香的烟很小，那是电路在工作间的香。",
        "焊坏过的点都变成了经验，焊好的变成了作品。",
        "烙铁：我不是烫，我是热情。" ] },
      { x: 16, y: 42.5, w: 17, h: 28, tip: "蓝色的元件柜", lines: [
        "元件柜的抽屉按心情分类：电阻、电容、和『以后再说』。",
        "每个抽屉里都住着一个『拆开过就装不回去』的谜。",
        "柜子最深处有一盒零件，是从唐山背来的库存。（su）",
        "抽屉拉开的顺序就是解谜攻略，可惜没人写下来。",
        "电阻说：我对一切都保持 220 欧的冷静。" ] },
      { x: 86, y: 74, w: 27, h: 14, tip: "摊开的图纸", lines: [
        "图纸上画了三条路：A、B、和被划掉的 C。",
        "笔压在纸上——主人是被人喊去吃饭的。",
        "图纸的角落写着一行小字：周四可以熬夜，其余早点睡。",
        "橡皮擦过的地方，藏着一个更笨但更开心的方案。",
        "这张图改到第七版的名字是：最终版_真的最终版。" ] },
      { x: 12, y: 70, w: 22, h: 18, tip: "搭着蓝布的椅子", lines: [
        "椅背上的蓝布已经三个小时没动了。",
        "它转了个方向——说明刚才有人决定换个思路。",
        "椅子的高度只肯配合最好的坐姿和最烂的草稿。",
        "椅子的记忆：驮过两个熬夜的人，一头拉萨，一头广州。",
        "椅子的座垫知道所有「就写五行代码就去睡」的谎言。" ] }
    ],
    "misc.html": [
      { x: 59, y: 72, w: 10, h: 16, tip: "桌上那支钢笔", lines: [
        "钢笔饿了，上一次吃饱是一封没寄出的信。",
        "它写坏的字都很好看，气人。",
        "它写过最短的回复：六个字。也写过二十万字的长篇。（ee）",
        "笔帽上有一道牙印，据说来自某次灵感咬紧牙关。",
        "手写比语音金贵——毕竟全屋只有笔不会把话转成繁体。（ee）" ] },
      { x: 83, y: 18, w: 23, h: 20, tip: "干花", lines: [
        "花干了，颜色反而记得更牢。",
        "夹在书里的那页，是它最想的春天。",
        "本屋住民的存档癖发作了：干花从不接受采访，只负责被归档。",
        "它记得自己是哪天被插进瓶子里的，那天也有人心情很好。",
        "新鲜的时候是花，干了以后是纪念品。" ] },
      { x: 31, y: 39, w: 33, h: 22, tip: "旧胶片相机", lines: [
        "里面还剩最后三张，谁都不敢乱按。",
        "它拍过最好的一张，是没拍成的那张。",
        "它拍过路牌、长椅和傍晚的街，全是走路走出来的构图。",
        "三张底片的分配方案：一张黄昏，一张猫，一张还没想好。",
        "相机最懂：最好的照片都是『回头补一张吧』之前的那个瞬间。" ] },
      { x: 10, y: 23, w: 20, h: 26, tip: "桌角的旧书堆", lines: [
        "书堆的排列顺序 = 读过的顺序，藏着一个人的时间线。",
        "最底下那本压了很久，书页都学会了那个形状。",
        "旧书的味道是纸的年轮。",
        "第二本被折了角的那页，写着一半的批注。",
        "其中一本正打算从广州寄去拉萨，邮费比书贵。（真的）" ] },
      { x: 60.5, y: 39, w: 21, h: 26, tip: "玻璃贝壳罐", lines: [
        "罐子里的贝壳来自濠江的海边，浪声带着一点咸。",
        "贴着耳朵能听见那天下午的风。",
        "双边贸易已达成：一罐贝壳换一罐高原的雪。（ee ↔ su）",
        "罐子说：我装的不是贝壳，是舍不得扔的那天。",
        "潮汐被压缩进玻璃罐里，每天拧开一次。" ] },
      { x: 82.5, y: 42, w: 16, h: 26, tip: "蓝白花瓶", lines: [
        "花瓶的蓝，和窗外那片海是同一天进的货。",
        "它常年只插一支花——省下的心思都给了这间屋子。",
        "瓶身的白花被阳光晒得半透明，像一整个下午。",
        "瓶底有两枚硬币，一枚广州一枚拉萨——许的是同一个愿。",
        "它觉得自己的本职工作是：让桌子不孤单。" ] },
      { x: 30, y: 70, w: 30, h: 22, tip: "摊开的素描本", lines: [
        "本子上的小镇还没画完，窗外那个已经先黑了。",
        "画到一半的屋顶，等一支补觉回来的笔。",
        "画风是从 4399 涂鸦板一路练出来的，鼠标画的，别小看。（ee）",
        "这页画的湖，比窗外那个胖一点，艺术加工。",
        "素描本的最后一页留白了，落款处写着：下次接着画。" ] },
      { x: 86, y: 73, w: 16, h: 24, tip: "羽毛笔", lines: [
        "羽毛笔的分工：钢笔写信，它写漂亮话。",
        "蘸一下墨，写三行，风向不对就再蘸一次。",
        "它坚持自己是桌上最有仪式感的工具，无人反驳。",
        "用它写文言文最顺手——序文那种，写完还能被朋友收藏。（ee）",
        "羽毛尖上还留着一点墨，像一句没说完就笑了的话。" ] }
    ],
    "music.html": [
      { x: 21.5, y: 66.5, w: 28, h: 10, tip: "黑胶唱片", lines: [
        "唱针落下的那一下，是整首歌的敬礼。",
        "今天它有点吃灰，因为主人去音游里点歌了。",
        "黑胶的仪式感：翻面比换歌隆重一百倍。",
        "针尖落下的沙沙声，是唱片在清嗓子。",
        "它转一圈，太阳就落一点，很划算。" ] },
      { x: 55.5, y: 81.5, w: 23, h: 21, tip: "金属小八音盒", lines: [
        "盒盖内侧有一行极小的字：留给下次的晚安。",
        "它报时比钟准——十一点整那声最响。（约）",
        "发条拧到头的咔哒声，是它说「今晚就到这儿」。",
        "八音盒记性不好，一支曲子要重复一辈子，但每次都认真。",
        "它和玻璃罩那位是邻居，平时互相校音。" ] },
      { x: 67, y: 55, w: 10, h: 10, tip: "窗沿的小鸟", lines: [
        "小鸟来听免费场，唱完才肯走。",
        "它每天七八点准时来，比某位的自然醒还准。（su）",
        "小鸟听歌时会歪头，是乐评人的职业习惯。",
        "它点过最贵的一首歌，是清晨五点那场独唱。",
        "别喂它面包屑，它只收旋律。" ] },
      { x: 23, y: 44, w: 30, h: 33, tip: "黄铜大喇叭", lines: [
        "喇叭的方向决定今晚的观众席：屋里的人，还是窗外的月。",
        "黄铜擦得太亮，音符出来都会先愣一下。",
        "它播过的歌比谁都老，心气比谁都年轻。",
        "喇叭一响，桌布的蕾丝边都跟着晃。",
        "它的拿手节目：每晚十一点，两地放同一首歌。" ] },
      { x: 82, y: 79, w: 30, h: 30, tip: "玻璃罩八音盒", lines: [
        "玻璃罩是它的包厢，曲子在里面转着圈不出去。",
        "罩子里的木马转一整圈，刚好一首歌。",
        "擦罩子的人有个原则：不许留下手印，只许留下倒影。",
        "它是全场唯一有观众的展品——那盆吊兰天天看。",
        "玻璃罩的用途：把一厘米的尘埃和一整个黄昏隔开。" ] },
      { x: 27, y: 16, w: 15, h: 18, tip: "搁板上的盆栽", lines: [
        "盆栽听歌的姿势：朝着喇叭，叶子微张。",
        "它长得歪，是常年给留声机让位的功劳。",
        "乐评口味随主人：电子乐晃叶，术力口整根摇摆。",
        "浇水的日子听什么都是摇篮曲。",
        "它悄悄挪了两厘米——想离那首老歌更近。" ] },
      { x: 79, y: 39, w: 25, h: 17, tip: "窗外的黄昏", lines: [
        "夕阳把云染成了唱片封套的颜色。",
        "窗外的树站成一排，像来听歌的。",
        "天色是今晚的第一首前奏曲。",
        "黄昏是最诚实的混音师——把 2295 公里外的天空也调成金色。",
        "窗外那片晚霞，是今天免费的安可。" ] }
    ],
    "gallery.html": [
      { x: 67, y: 20, w: 12, h: 7, tip: "挂相框的细绳", lines: [
        "细绳的承重：三张风景，和一点点骄傲。",
        "每次换画，绳子都假装很轻松。",
        "绳子绷直的原理：两头都是舍不得。",
        "它打过一个小结，被木夹子挡住了，不算工伤。",
        "绳子的账本：挂上去的从没摘下来过。" ] },
      { x: 40, y: 73, w: 14, h: 17, tip: "走廊的木凳", lines: [
        "凳子的用途：把一幅画看到天黑。",
        "坐下来看吧，画会不好意思动的。",
        "凳面被坐出的包浆，是观众的联名签名。",
        "它在走廊里的正式职务：第一排。",
        "把画看完再走——它对每个坐下的人都这么说。" ] },
      { x: 32, y: 12, w: 10, h: 9, tip: "暖色射灯", lines: [
        "灯是这里的太阳，画是它的行星。",
        "灯眨了一下眼——大概是风从门缝进来。",
        "射灯的光圈是每张画的限定舞台。",
        "闭馆之后，灯还替画多亮十分钟。",
        "它的光专门挑暖色，冷色的部分留给窗外。" ] },
      { x: 86.5, y: 22, w: 23, h: 30, tip: "最大的那幅风景", lines: [
        "这幅画挂在最高的地方，全墙都听它的。",
        "据说画里的城堡至今没有住满。",
        "它挂在离门最远的墙上，是馆长的心机：先看它，别的才看得下去。",
        "画框的木纹和桌子的木纹是一家出的。",
        "盯着看三十秒，能听见画里的湖在换气。" ] },
      { x: 42, y: 42.5, w: 19, h: 17, tip: "一排小相框", lines: [
        "小相框们排队站好，像一排没寄出的明信片。",
        "中间那个挂歪了一毫米，全体跟着歪出了默契。",
        "它们仨是同一圈朋友，聊的都是墙那头的事。",
        "小框里全是随手拍：推让了半天的四块钱冰淇淋。（ee）",
        "小有小的好处：可以离得很近看。" ] },
      { x: 95, y: 61, w: 10, h: 20, tip: "竖幅的花", lines: [
        "全墙唯一的花，负责替风景们问好。",
        "花是没有年轮的，画里的更没有。",
        "它开在竖着的画里，比横着的都要认真。",
        "画它的人一定记得花的香味，所以笔触都是软的。",
        "它不谢，是画册里最好的一条规矩。" ] },
      { x: 80.5, y: 80, w: 30, h: 15, tip: "柜子上的信件", lines: [
        "信封上没有邮票，邮局说这封只能亲手送。",
        "柜子上的一切都朝着门的方向摆——十一月有客人要来。",
        "明信片册翻到一半，正在等下一张贴上去。",
        "木盒里锁着的东西，据说是『以后再说』。",
        "桌角的小相框背对着我们，里面是谁，走廊保密。" ] },
      { x: 15, y: 44, w: 14, h: 21, tip: "走廊尽头的窗", lines: [
        "窗外的湖每天都换一种蓝。",
        "从窗口望出去的湖很近，想看的人很远：还差 2295 公里。",
        "窗框把湖山裁好，装进一个不要钱的画框。",
        "栏杆上停过一只鸟，被这幅画永久收录。",
        "这扇窗提醒大家：最大的收藏品挂在屋外。" ] }
    ],
    "cinema.html": [
      { x: 19, y: 35, w: 13, h: 11, tip: "放映机的光束", lines: [
        "光束里的灰尘，是电影院的星星。",
        "本厅循环放映，永不散场。",
        "手从光束里穿过去，可以在银幕上客串一座山。",
        "光束是全场唯一走直路的角色。",
        "灰尘飞得越欢，说明今晚的片子越好看。" ] },
      { x: 9, y: 69.5, w: 16, h: 12, tip: "爆米花", lines: [
        "爆米花的命运：活不过片头曲。",
        "甜的归她，咸的归他，微辣的那份至今没人领。",
        "碗底剩下的都是焦糖味最浓的——最后一颗留给谁，是历史难题。",
        "它坚持自己是正餐——参照某位连吃四天披萨的战绩。（su）" ] },
      { x: 46.5, y: 15, w: 11, h: 8, tip: "EXIT 灯", lines: [
        "出口的灯一直亮着，但没人舍得走。",
        "灯常亮着，意思是『随时欢迎回来』。",
        "全场最绿的灯，和某位住民的 representing 色撞了。（#44FF00）",
        "它是散场时刻唯一不低头的东西。",
        "EXIT 的意思是：外面还有小屋。" ] },
      { x: 6, y: 34, w: 12, h: 21, tip: "老放映机", lines: [
        "放映机转速恒定：一秒二十四格的踏实。",
        "它胸前的镜头擦得比谁都亮。",
        "机肚子里的胶片盘转起来，像时间在匀速散步。",
        "它是这间屋子最老的员工，比浇水值日勤快多了。",
        "放映员语录：片子会抖，是它激动。" ] },
      { x: 93, y: 26, w: 14, h: 46, tip: "亮着的银幕", lines: [
        "银幕上是今天：蓝天、白云、和一个还没去过的湖。",
        "银幕不挑片，只挑亮度。",
        "此刻银幕上的城堡，据说十一月会有人亲眼去看。",
        "银幕亮起来的时候，屋里所有人都成了同乡。",
        "银幕的规矩：只放想看第二遍的东西。" ] },
      { x: 68, y: 73, w: 41, h: 23, tip: "绿色的扶手椅", lines: [
        "两张椅子中间的距离，是给『一起看』留的。",
        "椅背上的毯子周四最忙——那是固定的熬夜档期。（su）",
        "椅子陷下去的弧度，是全场最诚实的影评。",
        "扶手的功能：放爆米花，和不敢先笑出的声音。",
        "散场之后，椅子们替所有人把结尾再坐一遍。" ] },
      { x: 46, y: 37.5, w: 30, h: 36, tip: "双开木门", lines: [
        "门在这屋里是反着用的：散场才开，开场必关。",
        "门缝里漏进来的光，是下一场的预告。",
        "木门的隔音效果约等于零，但观众都很自觉。",
        "门后挂着一排票根，风一吹就哗啦响。",
        "有人数过，门上每道木纹都朝着银幕的方向。" ] },
      { x: 25, y: 20, w: 7, h: 10, tip: "暖黄的壁灯", lines: [
        "壁灯在开演前最后一个熄灭，散场后第一个醒来。",
        "它负责仪式感：明和暗之间那一步。",
        "灯罩的黄色是全场最暖的暖场嘉宾。",
        "壁灯眨眼的速度，就是片长——它也看完了。",
        "灯影落在木墙上，像谁画了一个不想回家的圆。" ] }
    ],
    "about.html": [
      { x: 50, y: 55, w: 40, h: 30, tip: "编外质检员", lines: [
        "质检标准：能枕着睡的地方才算合格。",
        "它审核过的稿子，猫毛就是签章。",
        "三花是本屋的官方配色，和窗帘撞色撞得最好看。",
        "它今天审了三页稿，准时趴下——反正那时两个主人都没空理它。",
        "质检员离岗须知：轻拿轻放，最好别拿。" ] },
      { x: 9, y: 53, w: 17, h: 27, tip: "旧油灯", lines: [
        "油灯退休了，改行当气氛组组长。",
        "它照亮的字最多，如今只照亮回忆。",
        "灯罩上那层薄灰要留着，那是岁月的哑光。",
        "它给住民的晚睡程度分了五档：23 点、0 点、1 点、2 点，和「三点必睡」档。（su）",
        "现在它只负责一件事：把黄昏多留一会儿。" ] },
      { x: 75, y: 84, w: 43, h: 22, tip: "翻开的书", lines: [
        "那一页停了很久——不是忘了读，是舍不得。",
        "书签是一根猫毛，据说是本人的签名。",
        "书页摊开的弧度，就是读到最喜欢那页的弧度。",
        "看书的猫和被看的花都默认：书比窗外的湖安静。",
        "这本书的最后一位读者把页角折了又抚平，反复三次。" ] },
      { x: 92, y: 21, w: 10, h: 9, tip: "落进湖里的太阳", lines: [
        "太阳正在湖里试水温——游泳的人都这习惯。（su）",
        "这个点的光最厚，铺在湖上像一层蜂蜜。",
        "它每天绕到湖对岸去，替两个人看两次黄昏。",
        "太阳落山之后，屋里的灯就是小太阳。",
        "今天也是被夕阳盖章认证过的一天。" ] },
      { x: 62, y: 29, w: 19, h: 16, tip: "窗外的村庄", lines: [
        "对岸的屋顶排着队，各自戴一顶晚霞。",
        "钟楼的指针走得慢，村子过的是分钟。",
        "听说村里有家店，卖全湖最好的面包，15 块起。（su）",
        "房子们挤在一起取暖的样子，很像一张明信片。",
        "钟楼每天替这个湖报时，从不迟到。" ] },
      { x: 92, y: 30, w: 16, h: 9, tip: "湖面的光", lines: [
        "湖把太阳的光还给天上一半，剩下的存起来。",
        "水面的光斑是湖的日记，一天写一页。",
        "今天的湖很平，适合把心事放上去漂一会儿。",
        "光在水上走，走得很慢，谁也不催。",
        "湖的对岸有人也在看湖——这个想法让湖很得意。" ] },
      { x: 23, y: 19.5, w: 15, h: 11, tip: "花瓶里的小白花", lines: [
        "白花低头，是在跟猫请安。",
        "瓶里的花一开，屋子就自动有了香味。",
        "它离猫最近，是全屋最危险的花，也是最安全的。",
        "花瓣落在窗台上，谁也没舍得扫。",
        "花说：不出声，就是我的存在感。" ] },
      { x: 25, y: 41, w: 20, h: 12, tip: "猫背后的靠枕", lines: [
        "枕头凹下去的角度，是猫的独家定制。",
        "它垫着猫的整个梦想，压力很大但很幸福。",
        "枕套上的碎花和坐垫是一套的，本屋的制服。",
        "太阳晒过的那一面，永远抢手。",
        "枕头的职业理想：被世界级的脸蹭。" ] }
    ],
    "cat.html": [
      { x: 40, y: 45, w: 40, h: 20, tip: "摸摸它", pet: true }
    ]
  };

  /* ---------- 给封图挂热区 ---------- */
  const frame = document.querySelector(".win-frame");
  const page = location.pathname.split("/").pop();
  if (frame && FRAME_SPOTS[page]) {
    FRAME_SPOTS[page].forEach((sp) => {
      const el = document.createElement("button");
      el.className = "frame-hot" + (sp.y < 40 ? " edge-top" : "");
      el.style.setProperty("--x", sp.x + "%");
      el.style.setProperty("--y", sp.y + "%");
      el.style.setProperty("--w", sp.w + "%");
      el.style.setProperty("--h", sp.h + "%");
      el.dataset.tip = sp.tip;
      el.title = sp.tip;
      el.setAttribute("aria-label", sp.tip);

      if (sp.pet) {
        /* 猫威见：摸猫（点热区 + 计数徽章） */
        const chip = document.createElement("span");
        chip.className = "pet-chip";
        frame.appendChild(chip);
        let n = +(localStorage.getItem("shichuang-pet") || 0);
        const sync = () => { chip.textContent = "已被摸 " + n + " 下"; };
        sync();
        el.addEventListener("click", () => {
          n++;
          localStorage.setItem("shichuang-pet", String(n));
          sync();
          const b = ensureBubble(frame);
          b.textContent = pick([
            "云撸猫也是撸猫，本次已通过云端认证。",
            "猫尾巴轻轻拍了一下你的手背。",
            "（被摸摸）——这句是 ee 的原话。",
            "检测到猫被摸了。播报：毛很软，建议续费。（su）",
            "呼噜声已启动，功率随摸次数上涨。",
            "猫正在加载下一次被摸的额度，请稍候。",
            "本猫收下了。回礼是一个慢悠悠的哈欠。",
            "摸满一百下，十一月解锁真人撸猫版。（已在路上）" ]);
          place(b, frame, sp.x, Math.max(sp.y - sp.h / 2, 6));
          flash(b);
        });
      } else {
        el.addEventListener("click", () => {
          const b = ensureBubble(frame);
          b.textContent = pick(sp.lines);
          place(b, frame, sp.x, Math.max(sp.y - sp.h / 2, 6));
          flash(b);
        });
      }
      frame.appendChild(el);
    });
  }

  function ensureBubble(host) {
    let b = host.querySelector(".frame-bubble");
    if (!b) {
      b = document.createElement("div");
      b.className = "frame-bubble";
      host.appendChild(b);
    }
    return b;
  }
  /* 气泡定宽后按中心落位：中心 x 夹在宿主内缘，避免探出边界 */
  function place(b, host, xPct, topPct) {
    const hw = host.clientWidth;
    const half = Math.min(b.offsetWidth / 2, hw / 2);
    b.style.left = Math.min(Math.max(hw * xPct / 100, half + 8), hw - half - 8) + "px";
    b.style.top = topPct + "%";
  }
  function flash(b) {
    b.classList.remove("show");
    void b.offsetWidth;
    b.classList.add("show");
    clearTimeout(b._t);
    b._t = setTimeout(() => b.classList.remove("show"), 3400);
  }

  /* ============================================================
     站内点缀小物件（页面边角，不在封面上）
     ============================================================ */
  const STANDING = [
    { cls: "spr-cup-whi",   page: "whispers.html", id: "wCup", title: "点一下杯子",
      img: "obj_teacup.png",
      say: () => pick([
        "（凑近）还是热的，刚泡的。",
        "家里又塞了一堆茶让我带走，杯子表示压力很大。（ee）",
        "饮 茶 先——",
        "比较养生的代茶饮，第四泡了还是淡的。（su）",
        "这杯是潮汕制造的，杯底刻着「功夫茶」三个字，很小，但很坚定。（ee）",
        "咖啡因敏感星人在这里改点了茶，理由是「茶比较温柔」。（ee）",
        "今日配额：三大杯，1500ml。本杯已超额，别问。（ee）" ]),
      steam: true },
    { cls: "spr-lamp-wor",  page: "workshop.html", id: "wLamp", title: "台灯开关",
      img: "obj_lamp.png",
      toggle: true,
      sayOn: "咔哒——亮了。23 点，正好开工。（ee）",
      sayOff: "灯灭了。说好的三点必睡，总得从关灯练起。（su）" },
    { cls: "spr-plant-mus", page: "music.html", id: "wPlant", title: "吊起来的小盆栽",
      img: "obj_plant.png",
      say: () => pick([
        "十一点的音乐准时响起，它连叶子都跟着抖了两下。",
        "今天也要努力往下垂（计划通）。",
        "它在吊篮里荡了一下，算是跟了拍子。",
        "它选的位置全屋最好：第一排，还带包厢。（吊篮就是包厢）" ]) },
    { cls: "spr-cam-mis",   page: "misc.html", id: "wCam", title: "挂在桌边的相机",
      img: "obj_camera.png",
      say: () => pick([
        "信科院的帅照没被选中，可能就是它按快门那秒走神了。（su）",
        "它总在你想拍的前一秒没电。",
        "它的胶卷哲学：拍下去的都会过期，没拍的永远新鲜。",
        "它拍得最多的是路牌和长椅——在濠江，边走边拍。（ee）" ]) },
    { cls: "spr-letter-ga", page: "gallery.html", id: "wLetter", title: "画框后的一封信",
      img: "obj_letter.png",
      say: () => pick([
        "收件人栏画了一只猫，寄件人栏画了一根黄瓜。（两人的字迹都认得出）",
        "上次寄到哪来着？写信的人自己也忘了。（su）",
        "信封背面有一行小字：『收到请回复，回声也行』。",
        "邮戳被雨水糊了，唯一的线索是邮票上的船，和一句「想邮的东西越来越多了」。" ]) },
    { cls: "spr-film-cin",  page: "cinema.html", id: "wFilm", title: "卷着的备用胶片",
      img: "obj_film.png",
      say: () => pick([
        "胶片卷得很整齐，据说越整齐越好看。",
        "备用片名：《原神牛逼的一百个瞬间》。",
        "片名备选：《石家庄到拉萨：四十小时硬座速通》。（膝盖已哭）",
        "待映新片：《把 2295 公里压缩成一张双人沙发》。（技术攻坚中）" ]) },
    { cls: "spr-plant-abo", page: "about.html", id: "wPlant", title: "窗边的绿萝",
      img: "obj_plant.png",
      say: () => pick([
        "小屋志旁边的绿植，负责见证历史。",
        "浇水值日：轮流摸鱼，谁也没发现。",
        "它往下垂的方式很讲究，据说是为了看清楚小屋志上新写的那行。",
        "它的叶子朝着窗外的湖——毕竟那边风景也好。（它自己觉得）" ]) }
  ];

  const pageFile = page || "index.html";
  STANDING.forEach((cfg) => {
    if (cfg.page !== pageFile) return;
    const host = document.querySelector(".page-main");
    if (!host) return;
    const el = document.createElement("button");
    el.className = "standing-sprite " + cfg.cls;
    el.title = cfg.title;
    el.setAttribute("aria-label", cfg.title);
    el.innerHTML = '<img src="assets/img/deco/' + cfg.img + '" alt="">';
    host.appendChild(el);
    if (cfg.steam) {
      const s = document.createElement("i"); s.className = "steam";
      el.appendChild(s);
    }
    bindOnce(el, () => {
      if (cfg.toggle) {
        const off = el.classList.toggle("off");
        say(el, off ? cfg.sayOff : cfg.sayOn);
      } else if (cfg.say) {
        say(el, cfg.say());
      }
    });
  });

  /* ---------- 慢读室：稿纸边的热茶 ---------- */
  const tea = document.getElementById("deskTeacup");
  if (tea) {
    bindOnce(tea, () => {
      wiggle(tea);
      say(tea, pick([
        "给你续上了。读到哪了？",
        "第三泡了，正好配下半篇。",
        "续的是家里塞来的那罐，喝慢点，喝完还有。（ee）"
      ]));
    });
  }

  /* ---------- 檐下碎语：便签点一下会晃 ---------- */
  document.querySelectorAll(".slips-wall .slip").forEach((slip) => {
    bindOnce(slip, () => wiggle(slip));
  });

  /* ---------- 拾遗集：桌上的小声 bb ---------- */
  const RELIC_LINES = [
    "抽屉里全是开头：没写完的故事、建了就空着的仓库，都等「想起什么再加」。（su）",
    "快门响过的那些瞬间，都算数。信科院的帅照除外。（su）",
    "失败的那些不叫失败，叫「小实验的草稿」。参考项目：eebot。（ee）"
  ];
  document.querySelectorAll(".relic").forEach((r, i) => {
    bindOnce(r, () => {
      let pop = r.querySelector(".relic-pop");
      if (!pop) {
        pop = document.createElement("div");
        pop.className = "relic-pop";
        r.appendChild(pop);
      }
      pop.textContent = RELIC_LINES[i % RELIC_LINES.length];
    });
  });

  /* ---------- 关于小屋：点住客卡片 ---------- */
  const WHO_LINES = [
    "「检测到今晚也聊到凌晨了。」——播报体发言人的自我总结。（su）",
    "「草。」——今日第 388 条，翻译过来是「很开心」。（ee）"
  ];
  document.querySelectorAll(".who").forEach((w, i) => {
    bindOnce(w, () => {
      let pop = w.querySelector(".relic-pop");
      if (!pop) {
        pop = document.createElement("div");
        pop.className = "relic-pop";
        w.querySelector(".who-body").appendChild(pop);
      }
      pop.textContent = WHO_LINES[i % WHO_LINES.length];
    });
  });

  /* ---------- 主页：氛围热区（天空、月亮、草地……） ---------- */
  const TINY_SPOTS = [
    { x: 80, y: 4, w: 22, h: 6, tip: "天边早到的星", lines: [
      "疑似看到了星星。也可能是飞机，但就说它是星星。",
      "星星不说话，只是在替谁亮着。",
      "星图的命名权归ee：她说那是59秒快门的超级月亮。（su）",
      "这是九点十朵云之外，今天的第一颗星。比宠物店那两颗晚了一步。",
      "海拔三千六的星星离得更近，但这里的也够真诚。（两边都收到了）" ] },
    { x: 91, y: 49, w: 12, h: 8, tip: "落日停了很久", lines: [
      "拉萨的日落要等到九点，晚是晚了点，值得。",
      "这里的天看着很低，云看多了都说高。",
      "广州那边天都黑透了，这边太阳才刚下班。（海拔高的下班晚）",
      "拉萨的太阳下班最晚——好像在替谁多看一会儿。",
      "太阳一走，23点的消息峰值就准时上线。" ] },
    { x: 51, y: 91, w: 30, h: 10, tip: "门口的小路", lines: [
      "路上有两串脚印，一串在高原，一串在海边。",
      "路尽头是邮局，最近想邮的东西越来越多了。",
      "十一月的某天，这路上会多出一串从两千多公里外来的脚印。",
      "路是石板铺的，走快了会错过绣球花的香气。",
      "路灯的排班表：傍晚六点，比星星早二十分钟。" ] },
    { x: 85, y: 75, w: 9, h: 13, tip: "山坡的草丛", lines: [
      "草丛里有蟋蟀在值夜班。",
      "风吹过来，山丘翻了个身。",
      "深夜里草丛窸窣了一下——再窸窣，屋顶的猫就该醒了。",
      "草叶上的露水，是夜晚写给早晨的短信。",
      "绣球花在脚下开成一片，蓝的紫的，全都招猫。" ] },
    { x: 12, y: 7, w: 20, h: 10, tip: "大树的树冠", lines: [
      "树冠很大，专门收留迷路的晚霞。",
      "风一摇，掉下来两三声鸟叫。",
      "它把整幅画的树荫都包了，报酬是每年多听一个夏天的蝉。",
      "据内部消息：它是被画进来的，因为画的人喜欢雨天和树。",
      "一片叶子落进屋顶的猫窝，猫睁了下眼，又睡了。" ] },
    { x: 25.5, y: 68.5, w: 10, h: 14, tip: "左侧的灯", lines: [
      "灯笼每天准时亮，比信还准时。",
      "一盏灯先亮，另一盏就不肯先睡。",
      "灯下站着一块暗礁似的花丛，春天会漫过它。",
      "这盏灯总亮到后半夜——屋里的人坚称这是「正常作息」。（并不）",
      "灯罩里住过一只飞蛾，后来它改行追晚霞了。" ] },
    { x: 74, y: 73, w: 8, h: 11, tip: "右侧的灯", lines: [
      "两盏灯约好的：一盏照小路，一盏照回来的人。",
      "灯影落在石阶上，像给路铺了一层薄薄的糖——吃甜的那位很喜欢。",
      "石阶的灯没有开关，全靠天黑。",
      "它常想起湖对岸那座塔尖：都是夜里替人守着的。",
      "亮着就好，亮着就有人肯把故事讲完。" ] },
    { x: 12, y: 83, w: 15, h: 14, tip: "阶边的绣球花", lines: [
      "绣球花把台阶围了一圈，像是怕谁上楼时不小心。",
      "蓝的紫的都齐了，是花了整整一个夏天调的色。",
      "花瓣上一颗露水，替整座山收着晚霞。",
      "它们收集全山的露水，只为开得像一场小规模的雨。",
      "开在路边的花，每一朵都算数。" ] },
    { x: 24.5, y: 19, w: 10, h: 14, tip: "烟囱和炊烟", lines: [
      "炊烟笔直，说明今天没有风，也没有心事。",
      "烟囱是屋顶的钢笔，一天写一封给天空的信。",
      "炊烟在催饭了——今晚是牛肉粿条。（ee）",
      "今晚吃意大利香肠和蘑菇。（唐山的九月规矩）",
      "烟走得很慢，像一封没有急事的信。" ] }
  ];
  const stage = document.getElementById("heroStage");
  if (stage) {
    TINY_SPOTS.forEach((sp) => {
      const el = document.createElement("button");
      el.className = "tiny-spot" + (sp.y < 50 ? " edge-top" : "");
      el.style.setProperty("--x", sp.x + "%");
      el.style.setProperty("--y", sp.y + "%");
      el.style.setProperty("--w", sp.w + "%");
      el.style.setProperty("--h", sp.h + "%");
      el.dataset.tip = sp.tip;
      el.title = sp.tip;
      el.addEventListener("click", () => {
        let b = stage.querySelector(".atmo-bubble");
        if (!b) {
          b = document.createElement("div");
          b.className = "atmo-bubble";
          stage.appendChild(b);
        }
        b.textContent = pick(sp.lines);
        place(b, stage, sp.x, Math.max(sp.y - sp.h / 2, 4));
        flash(b);
      });
      stage.querySelector(".spots").appendChild(el);
    });
  }

  /* ---------- 明信片墙：窗台的星星（愿望登记处） ---------- */
  if (frame && page === "gallery.html") {
    const star = document.createElement("button");
    star.className = "window-star";
    star.title = "许个愿";
    star.setAttribute("aria-label", "许愿星");
    star.innerHTML =
      '<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" stroke="none">' +
      '<path d="M12 2.5l2.6 6 6.4.5-4.9 4.3 1.5 6.2L12 16.2 6.4 19.5l1.5-6.2L3 9l6.4-.5z"/></svg>';
    frame.appendChild(star);
    bindOnce(star, () => {
      wiggle(star);
      say(star, pick([
        "愿望已登记，保管处：明信片墙。",
        "愿望：十一月的机票，一张，预算六百。（调研已完毕）（su）",
        "对星星许的愿，风会抄送一份给两千公里外。"
      ]), 3000);
    });
  }

  /* ---------- 八音盒：墙上的值日纸条 ---------- */
  const WALL_NOTES = [
    "值日表：一起听挂到第三天，谁也没舍得先退出。（ee）",
    "值日表：十一点整，拉萨和广州同时播放，误差不许超过三秒。",
    "值日表：本周认证——su 歌单里的英文歌还挺好听。（ee）",
    "值日表：认识之后才爱听歌的，不止一个人。（su）",
    "值日表：空歌单「aa」不是没建完，是留给以后一起听的。（su）",
    "值日表：三十六个歌单已按图书馆编目，本周主打《初中化学实验BGM》。（ee）"
  ];
  const sleeves = document.getElementById("sleeves");
  if (sleeves) {
    const wall = document.createElement("section");
    wall.className = "wall-notes";
    WALL_NOTES.forEach((t) => {
      const c = document.createElement("div");
      c.className = "wall-note-card";
      c.textContent = t;
      c.addEventListener("click", () => wiggle(c));
      wall.appendChild(c);
    });
    const anchor = document.querySelector(".music-note");
    if (anchor) anchor.before(wall); else sleeves.after(wall);
  }

  /* ---------- 关于小屋：信箱旗 + 小屋志的笔 ---------- */
  const mailBody = document.querySelector(".mail-body");
  if (mailBody) {
    const flag = document.createElement("button");
    flag.className = "mail-flag";
    flag.id = "mailFlag";
    flag.innerHTML =
      '<svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" stroke="none">' +
      '<path d="M5 2h2v16H5z"/><path d="M7 3h9l-2.5 3.5L16 10H7z"/></svg>升旗';
    const line = document.createElement("p");
    line.className = "mail-flag-line";
    mailBody.querySelector(".btn-ink").after(flag);
    flag.after(line);
    let raisedToday = false;
    flag.addEventListener("click", () => {
      flag.classList.toggle("raised");
      raisedToday = !raisedToday;
      line.textContent = raisedToday
        ? "旗子升起来了。风会替你盯着邮路，顺路捎上想邮的那些。"
        : "旗子放下了。信已收进今天的班次。";
      say(flag, raisedToday ? "有信啦——" : "下次再来~", 2200);
    });
  }

  const logBody = document.querySelector(".log-body");
  if (logBody) {
    const pen = document.createElement("button");
    pen.className = "log-pen";
    pen.title = "拿笔添一行";
    pen.setAttribute("aria-label", "用钢笔添一行");
    pen.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><path d="M4 20l1-5L16 4l4 4-11 11z"/>' +
      '<path d="M14 6l4 4"/></svg>';
    logBody.parentElement.appendChild(pen);
    const PEN_LINES = [
      ["2026-09-10", "有人用钢笔在页脚写：从今天起，不叫朋友了。"],
      ["2026-11-??", "旁边多了一行提前占好的小字：等到啦。（广州站见）"],
      null
    ];
    let n = 0;
    pen.addEventListener("click", () => {
      if (n < PEN_LINES.length - 1) {
        const d = document.createElement("div");
        d.className = "log-line pen-in";
        d.innerHTML =
          '<span class="log-date">' + PEN_LINES[n][0] + "</span>" + PEN_LINES[n][1];
        logBody.appendChild(d);
        n++;
      } else if (n === PEN_LINES.length - 1) {
        const d = document.createElement("div");
        d.className = "log-line pen-in";
        d.innerHTML = '<span class="log-date">▬▬▬</span>纸用完了，笔帽盖上了。';
        logBody.appendChild(d);
        n++;
        pen.style.opacity = ".35";
        pen.title = "笔帽已盖上";
      }
    });
  }
})();
