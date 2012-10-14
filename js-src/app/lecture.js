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
      this.model.on("change", function() { this.render(); }, this);
      this.render();
    },

    template: _.template($("#lecture-template").html()),

    templateEdit: _.template($("#lecture-template-edit").html()),

    render: function (template) {
      var json = this.model.toJSON();
      json.date = helpers.getDateStr(this.model.getDate());
      json.time = helpers.getTimeStr(this.model.getDate());

      template = _.isFunction(template) ? template : this.template;

      this.$el.html(
        template(json)
      );
    },

    events: {
      "click .lecture-edit": "onEdit",
      "click .lecture-edit-cancel": "onEditCancel",
      "click .lecture-edit-save": "onEditSave",
    },

    onEdit: function (e) {
      e.preventDefault();
      this.render(this.templateEdit);
    },

    // TODO: Add live validation
    // TODO: Move validateion to another module
    onEditSave: function (e) {
      e.preventDefault();

      var data = {},
        date,
        $datetimeGroup;

      this.$el.find("input").each(function (i, el) {
        var $el = $(el);

        data[$el.attr("name")] = $el.val();
      });

      data["description"] = this.$el.find("[name=description]").val();

      date = helpers.parseDateStr(data.date + " " + data.time);

      if (!date.isValid()) {
        $datetimeGroup = this.$el.find(".control-group-datetime").addClass("error");
        if (!$datetimeGroup.find(".help-inline").length) {
          $("<span>", {
            class: "help-inline",
            text: "Дата введена неверно. Соблюдайте формат дд.мм.ггг для даты и формат чч:мм для времени."
          }).appendTo($datetimeGroup);
        }
      }else {
        data["timestamp"] = date.unix() * 1000;

        delete data["date"];
        delete data["time"];

        this.model.set(data);

        if (!this.model.hasChanged()) {
          this.render();
        }
      }
    },

    onEditCancel: function (e) {
      e.preventDefault();
      this.render();
    }
  });

  return {
    Model: Model,
    View: View
  };
});