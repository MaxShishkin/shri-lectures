define(["jquery", "underscore", "backbone", "app/helpers"], function ($, _, Backbone, helpers) {

  var Model = Backbone.Model.extend({
    initialize: function () {
      this.on("change:timestamp", function () {
        delete this.getDate.date;
      });
    },

    getDate: function () {
      if (this.getDate.date === undefined) {
        this.getDate.date = new Date(this.get("timestamp"));
      }

      return this.getDate.date;
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
      this.render();
    },

    template: _.template($("#lecture-template").html()),

    render: function () {
      var json = this.model.toJSON();
      json.date = helpers.getDateStr(this.model.getDate());
      json.time = helpers.getTimeStr(this.model.getDate());

      this.$el.append(
        this.template(json)
      );
    }
  });

  return {
    Model: Model,
    View: View
  };
});