define(["jquery", "underscore", "app/helpers", "app/lecture", "app/schedule", "app/collectionsGroup"],
function ($, _, helpers, lecture, schedule, CollectionsGroup) {
  var lecturesByDay,

    $display,

    scheduleViews = {},

    storage,

    init = function ($aDisplay, aStorage) {
      $display = $aDisplay;

      storage = aStorage;

      lecturesByDay = new CollectionsGroup(schedule.Model, function (model) {
        return helpers.getDateStr(model.getDate());
      });

      addListeners();
      loadFromStorage();
    },

    loadFromStorage = function () {
      var stored = storage.restoreFromLocalStorage();
      createModels(stored);
    },

    createModels = function (data) {
      _.each(data, function (item) {
        var aLecture = new lecture.Model(item);
        add(aLecture);
      });
    },

    addListeners = function () {
      lecturesByDay.on("collectionCreated", onCollectionCreated);
      lecturesByDay.on("collectionRemoved", onCollectionRemoved);
    },

    onCollectionCreated = function (aSchedule) {
      var aScheduleView,
        closestView = {weight: 0};

      aSchedule.on("destroy", remove);

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
      if (!(aLecture instanceof lecture.Model)) {
        aLecture = new lecture.Model(aLecture);
      }

      lecturesByDay.add(aLecture);
      storage.add(aLecture);
    },

    remove = function (aLecture) {
      lecturesByDay.remove(aLecture);
      storage.remove(aLecture);
    },

    exportJSON = function () {
      return storage.toJSON();
    },

    importJSON = function (json) {
      var parsed,ject
        error = false;

      try {
        parsed = JSON.parse(json);
      } catch (e) {
        error = true;
      }

      if (!error) {
        storage.clear();
        $display.empty();
        scheduleViews = {};
        init($display, storage);
        createModels(parsed);
        window.location.hash = "#";
      }
    };

  return {
    init: init,
    add: add,
    remove: remove,
    exportJSON: exportJSON,
    importJSON: importJSON
  };
});