require(["jquery", "app/navigation/sectionNavigation", "app/scheduleController", "app/pages", "app/collectionStorage"],
function ($, sectionNavigation, controller, pages, CollectionStorage) {
  sectionNavigation.init("#view", $(".nav"));

  storage = new CollectionStorage("shri_lectures");
  controller.init($("#view"), storage);

  pages.init(controller);
});