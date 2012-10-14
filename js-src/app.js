require(["jquery", "app/navigation", "app/lecture", "app/schedule"], function ($, nav, lecture, schedule) {
  nav.init("#view", $(".nav"));

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

  cLecture = new lecture.Model({
    timestamp: 7867687,
    title: "Some old lection",
    lecturer: "Old man",
    description: "How to survive for years."
  });

  var aSchedule = new schedule.Model([aLecture, bLecture], "Awesome lectures series");
  var bSchedule = new schedule.Model([cLecture], "Awesome lectures series");

  var aScheduleView = new schedule.View({
    collection: aSchedule
  });
  var bScheduleView = new schedule.View({
    collection: bSchedule
  });

  $("#view").append(aScheduleView.$el);
  $("#view").append(bScheduleView.$el);

  aSchedule.remove(aLecture);
  bSchedule.add(aLecture);
});