require(["jquery", "app/navigation", "app/scheduleController", "app/pages", "app/collectionStorage", "app/lecture"],
function ($, nav, controller, pages, CollectionStorage, lecture) {
  nav.init("#view", $(".nav"));

  storage = new CollectionStorage("shri_lectures");
  controller.init($("#view"), storage);

  pages.init(controller);
});