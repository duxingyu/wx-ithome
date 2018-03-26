const util = require('../../utils/util.js');

Page({
  data: {
    circlelist: [],
    lastDate: 0,
  },
  onLoad() {
    this.getList('start');
  },
  onPullDownRefresh() {
    this.getList('refresh');
  },
  onReachBottom() {
    this.getList('load');
  },
  getList(state) {
    if (state === 'refresh') {
      this.data.circlelist = [];
    }
    if (state === 'start' || state === 'refresh') {
      this.data.lastDate = Date.now();
    }
    this.setData({
      circlelist: this.data.circlelist,
      lastDate: this.data.lastDate,
    });

    wx.request({
      url: 'https://apiquan.ithome.com/api/post',
      data: {
        categoryid: 0,
        type: 0,
        orderTime: this.data.lastDate,
        visistCount: '',
        pageLength: 20,
      },
      success: res => {
        const nowDate = Date.now();
        const newlist = res.data;
        const reg = /[(|)]/;

        this.data.lastDate = +newlist[19].rt.split(reg)[1];
        newlist.forEach(val => {
          val.rt = util.formatTime2(+val.rt.split(reg)[1], nowDate);
          val.pt = util.formatTime3(val.pt);
        });
        this.data.circlelist = [...this.data.circlelist, ...newlist];

        this.setData({
          circlelist: this.data.circlelist,
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
