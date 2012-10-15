require(["jquery", "app/navigation/sectionNavigation", "app/scheduleController", "app/pages", "app/collectionStorage", "app/lecture"],
function ($, sectionNavigation, controller, pages, CollectionStorage, lecture) {
  sectionNavigation.init("#view", $(".nav"));

  storage = new CollectionStorage("shri_lectures");
  controller.init($("#view"), storage);

  pages.init(controller);
});