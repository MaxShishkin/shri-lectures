define(["jquery", "underscore", "backbone", "app/utils/dateUtil"], function ($, _, Backbone, dateUtil) {

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
      json.date = dateUtil.getDateStr(this.model.getDate());
      json.time = dateUtil.getTimeStr(this.model.getDate());

      template = _.isFunction(template) ? template : this.template;

      this.$el.html(
        template(json)
      );
    },

    events: {
      "click .lecture-edit": "onEdit",
      "click .lecture-delete": "onDelete",
      "click .lecture-edit-cancel": "onEditCancel",
      "click .lecture-edit-save": "onEditSave"
    },

    onEdit: function (e) {
      e.preventDefault();
      this.render(this.templateEdit);
    },

    onDelete: function (e) {
      e.preventDefault();
      this.model.destroy()
    },

    onEditSave: function (e) {
      e.preventDefault();
      var form = this.proccessEditForm(this.$el);

      if (form.isValid) {
        form.input.timestamp = form.processed.date.unix() * 1000;

        delete form.input.date;
        delete form.input.time;

        this.model.set(form.input);

        if (!this.model.hasChanged()) {
          this.render();
        }
      }
    },

    onEditCancel: function (e) {
      e.preventDefault();
      this.render();
    },

    // TODO: Add live validation
    // TODO: Move validateion to another module ?
    proccessEditForm: function ($frmContainer) {
      var form = {
        input: {},
        processed: {},
        isValid: true
      },
      $datetimeGroup;

      $frmContainer.find("input, textarea").each(function (i, el) {
        var $el = $(el);
        form.input[$el.attr("name")] = $el.val();
      });

      form.processed.date = dateUtil.parseDateTimeStr(form.input.date + " " + form.input.time);
      form.isValid = form.processed.date.isValid();

      if (!form.isValid) {
        $datetimeGroup = $frmContainer.find(".control-group-datetime").addClass("error");
        if (!$datetimeGroup.find(".help-inline").length) {
          $("<span>", {
            class: "help-inline",
            text: "Дата введена неверно. Соблюдайте формат дд.мм.ггг для даты и формат чч:мм для времени."
          }).appendTo($datetimeGroup);
        }
      }

      return form;
    }
  });

  return {
    Model: Model,
    View: View
  };
});