define(["jquery", "underscore", "backbone", "app/lecture"], function ($, _, Backbone, lecture) {
  var Model = Backbone.Collection.extend({
    model: lecture.Model,

    title: "",

    comparator: function(aLecture) {
      return aLecture.get("timestamp");
    },

    initialize: function (models, title) {
      this.title = title;
    }
  });

  // TODO: Partial re-render on add and remove events
  var View = Backbone.View.extend({
    tagName: "div",

    attributes: {
      class: "schedule"
    },

    views: {},

    initialize: function () {
      this.collection.on("add", this.render, this);
      this.collection.on("remove", this.onModelRemoved, this);

      this.render();
    },

    onModelRemoved: function (aLecture) {
      delete this.views[aLecture.cid];
      this.render();
    },

    template: _.template($("#schedule-template").html()),

    render: function () {
      var aLectureView,
      $container;

      this.$el.html(this.template({
        title: this.collection.title
      }));

      $container = this.$el.find(".schedule-lectures");

      _.each(this.collection.models, function (aLecture) {
        aLectureView = this.views[aLecture.cid];

        if (!aLectureView) {
          aLectureView = new lecture.View({model: aLecture});
          this.views[aLecture.cid] = aLectureView;
        }

        $container.append(aLectureView.$el);
      }, this);
    }
  });

  return {
    Model: Model,
    View: View
  }
});