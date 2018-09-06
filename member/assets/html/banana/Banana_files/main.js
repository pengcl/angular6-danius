var r = n(103), i = function (t) {
  return t && t.__esModule ? t : {default: t}
}(r);
var cc = {
  list: ["长沙王**购买了该商品，3秒前", "天津李**购买了该商品，4秒前", "北京郭**购买了该商品，5秒前", "西宁马**购买了该商品，7秒前", "广州颜**购买了该商品，12秒前", "成都冼**购买了该商品，23秒前", "无锡王**购买了该商品，34秒前", "温州马**购买了该商品，45秒前", "拉萨阿**购买了该商品，56秒前", "深圳唐**购买了该商品，59秒前"],
  headLength: 20,
  scrollHeight: 36,
  top: 0,
  totalLoop: 0,
  wrapper: document.querySelector(".marquee-wrapper"),
  container: document.querySelector("#marqueeContainer"),
  init: function () {
    this.wrapper && this.container && this.load(function () {
      if (this.list && this.list.length) {
        if (this.container.innerHTML = this.createHTML(!0, 0) + this.createHTML(!1, this.list.length), !i.default.hasFirstImage()) {
          document.querySelector(".pic-module") || (this.wrapper.style["margin-top"] = "0px")
        }
        i.default.removeClass(this.wrapper, "hide"), this.run()
      }
    }.bind(this))
  },
  createHTML: function (t, e) {
    for (var n = "", r = 0; r < this.list.length; r++) {
      var o = (r + e) * this.scrollHeight, a = "/images/head" + i.default.randomRange(1, this.headLength) + ".png",
        u = '<div style="background-image: url(' + a + ')">' + i.default.htmlXssFilter(this.list[r]) + "</div>";
      n += t ? 0 == r ? '<li style="opacity: 0; top: ' + o + 'px;">' + u + "</li>" : 1 == r ? '<li style="opacity: 0.9; top: ' + o + 'px;">' + u + "</li>" : 2 == r ? '<li style="opacity: 0.3; top: ' + o + 'px;">' + u + "</li>" : '<li style="top: ' + o + 'px;">' + u + "</li>" : '<li style="top: ' + o + 'px;">' + u + "</li>"
    }
    return n
  },
  load: function (t) {
    var e = this;
    for (var r = 0; r < e.list.length; r++) e.list[r].length > 18 && (e.list[r] = e.list[r].substr(0, 18) + "...");
    t && t()
  },
  run: function () {
    var t = this;
    window.setInterval(function () {
      t.updateUI(), t.totalLoop++
    }, 1e3)
  },
  updateUI: function () {
    var t = 0;
    if (this.totalLoop % this.list.length == 0 && this.totalLoop > 0) for (; t < this.list.length;) this.container.querySelector("li").style.top = (this.list.length + t) * this.scrollHeight + "px", this.container.appendChild(this.container.querySelector("li")), t++;
    var e = this.container.querySelectorAll("li");
    for (t = 0; t < e.length; t++) {
      var n = parseFloat(e[t].style.top);
      n == this.scrollHeight ? e[t].style.opacity = 0 : n == 2 * this.scrollHeight ? e[t].style.opacity = .9 : n == 3 * this.scrollHeight && (e[t].style.opacity = .3), e[t].style.top = n - this.scrollHeight + "px"
    }
  }
};

cc.init();
