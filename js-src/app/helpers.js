define({
  getDateStr: function (date) {
    return this.formatDateNumber(date.getDate()) + "." +
      this.formatDateNumber(date.getMonth() + 1) + "." +
      date.getFullYear();
  },

  getTimeStr: function (date) {
    return this.formatDateNumber(date.getHours()) + ":" + this.formatDateNumber(date.getMinutes());
  },

  formatDateNumber: function (num) {
    return ("" + (num / 100 + 0.001)).substr(2, 2);
  }
});