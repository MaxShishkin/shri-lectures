require(["jquery", "app/navigation/sectionNavigation", "app/scheduleController", "app/misc/pages", "app/storage/modelStorage", "app/models/lecture"],
function ($, sectionNavigation, controller, pages, ModelStorage, Lecture) {
  sectionNavigation.init("#view", $(".nav"));

  storage = new ModelStorage("shri_lectures", Lecture.Model);
  storage.restore();

  controller.init($("#view"), storage);

  pages.init(controller);
});