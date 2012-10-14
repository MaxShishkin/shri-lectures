define(["jquery", "underscore", "app/helpers", "app/lecture", "app/schedule", "app/collectionsGroup"],
function ($, _, helpers, lecture, schedule, CollectionsGroup) {
  var lecturesByDay,

    $display,

    scheduleViews = {};

    init = function ($aDisplay) {
      $display = $aDisplay;

      lecturesByDay = new CollectionsGroup(schedule.Model, function (model) {
        return helpers.getDateStr(model.getDate());
      });

      addListeners();
    },

    addListeners = function () {
      lecturesByDay.on("collectionCreated", onCollectionCreated);
      lecturesByDay.on("collectionRemoved", onCollectionRemoved);
    },

    onCollectionCreated = function (aSchedule) {
      var aScheduleView,
        closestView = {weight: 0};

      aSchedule.title = helpers.getDateStr(aSchedule.at(0).getDate());

      aScheduleView = new schedule.View({
        collection: aSchedule
      });

      aScheduleView.weight = aSchedule.at(0).get("timestamp");

      _.each(scheduleViews, function (view, hash) {
        if (view.weight > closestView.weight && view.weight < aScheduleView.weight) {
          closestView = view;
        }
      });

      scheduleViews[aSchedule.hash] = aScheduleView;

      if(closestView.weight) {
        closestView.$el.after(aScheduleView.$el);
      } else {
        $display.prepend(aScheduleView.$el);
      }
    },

    onCollectionRemoved = function (aSchedule) {
      var aScheduleView = scheduleViews[aSchedule.hash];

      aScheduleView.$el.remove();

      delete scheduleViews[aSchedule.hash];
    },

    add = function (aLecture) {
      lecturesByDay.add(aLecture);
    },

    remove = function (aLecture) {
      lecturesByDay.remove(aLecture);
    };

  return {
    init: init,
    add: add,
    remove: remove
  };
});