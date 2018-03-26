const util = require('../../utils/util.js');
const xml2json = require('../../utils/xml2json.min.js');

Page({
  data: {
    newslist: [],
    slide: [],
    lastDate: 0,
  },
  onLoad() {
    this.getList('start');
    this.getSlide();
  },
  onPullDownRefresh() {
    this.getList('refresh');
  },
  onReachBottom() {
    this.getList('load');
  },
  getSlide() {
    wx.request({
      url: 'https://api.ithome.com/xml/slide/slide.xml',
      success: res => {
        this.data.slide = xml2json(res.data).rss.channel.item;
        this.setData({
          slide: this.data.slide,
        });
      },
      fail: err => {
        console.log(err);
      },
    });
  },
  getList(state) {
    if (state === 'refresh') {
      this.data.newslist = [];
    }
    if (state === 'start' || state === 'refresh') {
      this.data.lastDate = Date.now();
    }
    this.setData({
      newslist: this.data.newslist,
      lastDate: this.data.lastDate,
    });
    wx.request({
      url: 'https://api.ithome.com/json/newslist/news',
      data: {
        r: this.data.lastDate,
      },
      success: res => {
        const list = res.data.newslist.filter(val => {
          return !val.lapinid;
        });

        this.data.lastDate = +new Date(list[list.length - 1].postdate);

        list.forEach(val => {
          val.postdate = util.formatTime(val.postdate);
        });
        this.data.newslist = [...this.data.newslist, ...list];

        this.setData({
          newslist: this.data.newslist,
          lastDate: this.data.lastDate,
        });
        if (state === 'refresh') wx.stopPullDownRefresh();
      },
      fail: err => {
        console.log(err);
      },
    });
  },
});
