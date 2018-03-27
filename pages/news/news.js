const util = require('../../utils/util.js');
const WxParse = require('../../wxParse/wxParse.js');
const xml2json = require('../../utils/xml2json.min.js');

Page({
  data: {
    news: {},
    content: '',
    relate: [],
    title: '',
  },
  onLoad: function(options) {
    this.getNews(options.id);
    this.getRelate(options.id);
    this.data.title = options.title;
    this.setData({
      title: this.data.title,
    });
  },
  getNews(id) {
    wx.request({
      url: `https://api.ithome.com/xml/newscontent/${id.slice(0, 3)}/${id.slice(3)}.xml`,
      success: res => {
        this.data.news = xml2json(res.data).rss.channel.item;

        WxParse.wxParse('content', 'html', this.data.news.detail['#text'], this, 20);
        this.setData({
          news: this.data.news,
        });
        console.log(this.data.news);
      },
      fail: err => {
        console.log(err);
      },
    });
  },
  getRelate(id) {
    wx.request({
      url: `https://api.ithome.com/json/tags/0${id.slice(0, 3)}/${id}.json`,
      success: res => {
        this.data.relate = JSON.parse(res.data.split('var tag_jsonp =')[1]).slice(0, 3);
        this.setData({
          relate: this.data.relate,
        });
      },
      fail: err => {
        console.log(err);
      },
    });
  },
});
