define(["jquery", "underscore", "backbone", "app/helpers"], function ($, _, Backbone, helpers) {

  var Model = Backbone.Model.extend({
    initialize: function () {
      this.on("change:timestamp", function () {
        delete this._date;
      });
    },

    getDate: function () {
      if (this._date === undefined) {
        this._date = new Date(this.get("timestamp"));
      }

      return this._date;
    },

    defaults: {
      timestamp: 0,
      title: "",
      lecturer: "",
      description: ""
    }
  });

  var View = Backbone.View.extend({
    tagName: "div",

    attributes: {
      class: "lecture"
    },

    initialize: function () {
      this.model.on("change", this.render, this);
      this.render();
    },

    template: _.template($("#lecture-template").html()),

    render: function () {
      var json = this.model.toJSON();
      json.date = helpers.getDateStr(this.model.getDate());
      json.time = helpers.getTimeStr(this.model.getDate());

      this.$el.html(
        this.template(json)
      );
    },

    events: {
      "click .lecture-edit" : "onEdit"
    },

    onEdit: function (e) {
      e.preventDefault();
    }
  });

  return {
    Model: Model,
    View: View
  };
});