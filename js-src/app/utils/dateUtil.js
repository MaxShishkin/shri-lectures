define(["moment"], function (moment) {
  return {
    getDateStr: function (date) {
      return moment(date).format("D.MM.YYYY");
    },

    getTimeStr: function (date) {
      return moment(date).format("HH:mm");
    },

    parseDateTimeStr: function (dateStr) {
      return moment(dateStr, "DD.MM.YYYY HH:mm");
    }
  }
});