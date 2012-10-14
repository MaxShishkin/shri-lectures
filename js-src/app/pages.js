define(["jquery", "underscore", "app/lecture"], function ($, _, lecture) {

  var scheduleController,

  init = function (aScheduleController) {
    scheduleController = aScheduleController;
    initAddSection();
    initExportSection();
    initImportSection();
  },

  // TODO: Rewrite, it's awfull
  // TODO: No manual input of default props!
  initAddSection = function () {
    var $tpl = $(_.template($("#lecture-template-edit").html(), {
      date: "",
      time: "",
      title: "",
      lecturer: "",
      description: ""
    }));

    $tpl.find(".lecture-edit-save").on("click", function (e) {
      event.preventDefault();

      var form = lecture.View.prototype.proccessEditForm($tpl);

      if (form.isValid) {
          form.input.timestamp = form.processed.date.unix() * 1000;

          delete form.input.date;
          delete form.input.time;

          var aLecture = new lecture.Model(form.input);

          scheduleController.add(aLecture);

          $tpl.find("input, textarea").each(function (i, el) {
            var $el = $(el);
            $el.val("");
          });

          window.location.hash="#view";
      }
    });

    $tpl.find(".lecture-edit-cancel").on("click", function (e) {
      e.preventDefault();
      window.location.hash="#view";
    });

    $("#add").append($tpl);
  },

  initExportSection = function () {
    $(".export-start").on("click", function (e) {
      e.preventDefault();
      $(".export-area").val(scheduleController.exportJSON());
    });
  };

  initImportSection = function () {
    $(".import-start").on("click", function (e) {
      e.preventDefault();
      scheduleController.importJSON($(".import-area").val());
    });
  };

  return {
    init: init
  };
})