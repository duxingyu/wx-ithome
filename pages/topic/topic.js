const util = require('../../utils/util.js');
const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    info: {},
    d: {},
    replylist: [],
    lastDate: 0,
    more: true,
  },
  onLoad: function(d) {
    this.getList(d.id);
    this.data.info = d;
    this.data.d = {
      N: d.N,
      T: d.T,
      F: 1,
      C: '',
    };
    this.setData({
      info: this.data.info,
      d: this.data.d,
    });
  },
  onReachBottom() {
    if (this.data.more) {
      this.getMore();
    }
  },
  getList(id) {
    wx.request({
      url: `https://apiquan.ithome.com/api/post/${id}`,
      success: res => {
        let content = res.data.content;
        let crt = '';
        if (res.data.imgs) {
          content = content.split(/<!--IMG_\d+-->/);
          crt = content[0];
          res.data.imgs.forEach((val, index) => {
            crt += `<img src="${val}">` + content[index];
          });
        } else {
          crt = content;
        }
        WxParse.wxParse('d.C', 'html', crt, this, 20);
        this.formatList(res.data.reply);
        this.data.lastDate = res.data.reply[res.data.reply.length - 1].M.Ci;
        if (res.data.reply.length < 25) {
          this.data.more = false;
        }
        console.log(res.data);
      },
      fail: err => {
        console.log(err);
      },
    });
  },
  getMore() {
    wx.request({
      url: 'https://apiquan.ithome.com/api/reply',
      data: {
        postid: this.data.info.id,
        replyidlessthan: this.data.lastDate,
      },
      success: res => {
        if (!res.data.length) {
          this.data.more = false;
          return;
        }
        this.formatList(res.data);
        this.data.lastDate = res.data[res.data.length - 1].M.Ci;
      },
      fail: err => {
        console.log(err);
      },
    });
  },
  formatList(list) {
    const ind = this.data.replylist.length;
    list.forEach((val, index) => {
      this.data.replylist[ind + index] = {
        N: val.M.N,
        T: util.formatTime3(val.M.T),
        F: val.F,
        C: val.M.C,
        R: [],
      };
      WxParse.wxParse(`replylist[${ind + index}].C`, 'html', val.M.C, this, 20);

      if (val.R.length) {
        val.R.forEach((v, i) => {
          this.data.replylist[ind + index].R[i] = {
            N: v.N,
            T: util.formatTime3(v.T),
            F: v.Sf,
            C: v.C,
          };
          WxParse.wxParse(`replylist[${ind + index}].R[${i}].C`, 'html', v.C, this, 20);
        });
      }
    });
    this.setData({
      replylist: this.data.replylist,
    });
  },
});
