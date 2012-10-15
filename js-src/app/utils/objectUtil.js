define({
  expose: function (fn) {
    var that = this;

    return function () {
      that[fn].apply(that, arguments);
    }
  }
});