require(["jquery", "app/navigation", "app/scheduleController", "app/lecture"],
function ($, nav, controller, lecture) {
  nav.init("#view", $(".nav"));
  controller.init($("#view"));

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

  var dLecture = new lecture.Model({
    timestamp: aLecture.get("timestamp") + 10000000000,
    title: "Some old lection",
    lecturer: "Old man",
    description: "How to survive for years."
  });

  controller.add(aLecture);
  controller.add(bLecture);
  controller.add(cLecture);
  controller.add(dLecture);

  aLecture.set("title", "New changed title");
  controller.remove(bLecture);
  cLecture.set("timestamp", dLecture.get("timestamp"));
  aLecture.set("timestamp", dLecture.get("timestamp"));
});