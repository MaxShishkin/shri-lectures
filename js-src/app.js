require(["jquery", "app/navigation", "app/scheduleController", "app/pages", "app/lecture"],
function ($, nav, controller, pages, lecture) {
  nav.init("#view", $(".nav"));
  controller.init($("#view"));
  pages.init(controller);

  var aLecture = new lecture.Model({
      timestamp: new Date().getTime(),
      title: "New awesome lecture",
      lecturer: "Some Dude",
      description: "A lecture on being an awesome dude! Be shure to come!"
    });

  var bLecture = new lecture.Model({
    timestamp: new Date().getTime(),
    title: "New awesome lecture vol. 2",
    lecturer: "Some Dude",
    description: "A lecture on being an awesome dude continues!"
  });

  var cLecture = new lecture.Model({
    timestamp: new Date().getTime(),
    title: "New awesome lecture vol. 3",
    lecturer: "Some Dude",
    description: "A lecture on being an awesome dude continues!"
  });

  controller.add(aLecture);
  controller.add(bLecture);
  controller.add(cLecture);
});