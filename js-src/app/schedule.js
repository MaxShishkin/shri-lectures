define(["jquery", "underscore", "backbone", "app/lecture"], function ($, _, Backbone, lecture) {
  var Model = Backbone.Collection.extend({
    model: lecture.Model,

    title: "",

    comparator: function(aLecture) {
      return aLecture.get("timestamp");
    },

    initialize: function (models, title) {
      this.title = title;
      this.on("change:timestamp", this.sort, this);
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
      this.collection.on("reset", this.render, this);
      this.collection.on("remove", this.onModelRemoved, this);

      this.render();
    },

    onModelRemoved: function (aLecture) {
      this.views[aLecture.cid].$el.remove();
      delete this.views[aLecture.cid];
    },

    template: _.template($("#schedule-template").html()),

    softRender: false,

    // TODO: Rewrite in more sensible way
    render: function () {
      var aLectureView,
        $container;

      // Fully re-render template only if told so,
      // otherwise use existing objects.
      // Needed for maintaining existing events on objects.
      if (!this.softRender) {
        this.$el.html(this.template({
          title: this.collection.title
        }));

        $container = this.$el.find(".schedule-lectures");

        this.softRender = true;
      } else {
        $container = this.$el.find(".schedule-lectures");

        if (!$container.length) {
          $container = $("<div>", {
            class: ".schedule-lectures"
          });
        }

        $title = this.$el.find(".schedule-title-text");
        $title.text(this.collection.title);
      }

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