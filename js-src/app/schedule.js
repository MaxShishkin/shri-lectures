define(["jquery", "underscore", "backbone", "app/lecture"], function ($, _, Backbone, lecture) {
  var Model = Backbone.Collection.extend({
    model: lecture.Model,
    title: "",
    initialize: function (models, title) {
      this.title = title;
    }
  });

  var View = Backbone.View.extend({
    tagName: "div",

    attributes: {
      class: "schedule"
    },

    initialize: function () {
      this.render();
    },

    template: _.template($("#schedule-template").html()),

    render: function () {
      var lecturesHTML = "";

      _.each(this.collection.models, function (aLecture) {
        var lectureView = new lecture.View({model: aLecture});
        lecturesHTML += $("<div>").append(lectureView.$el).html();
      }, this);

      this.$el.append(this.template({
        title: this.collection.title,
        lectures: lecturesHTML
      }));
    }
  });

  return {
    Model: Model,
    View: View
  }
});