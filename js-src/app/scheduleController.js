define(["jquery", "underscore", "app/utils/dateUtil", "app/models/lecture", "app/collections/schedule", "app/collections/metaCollection"],
function ($, _, dateUtil, Lecture, Schedule, MetaCollection) {
  var lecturesByDay,

    $display,

    scheduleViews = {},

    storage,

    init = function ($aDisplay, aStorage) {
      $display = $aDisplay;

      storage = aStorage;

      lecturesByDay = new MetaCollection(Schedule.Model, function (model) {
        return dateUtil.getDateStr(model.getDate());
      });

      addListeners();
      loadFromStorage();
    },

    loadFromStorage = function () {
      _.each(storage.getModels(), function (model) {
        add(model);
      });
    },

    createModels = function (data) {
      _.each(data, function (item) {
        var aLecture = new Lecture.Model(item);
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

      aSchedule.title = dateUtil.getDateStr(aSchedule.at(0).getDate());

      aScheduleView = new Schedule.View({
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
      if (!(aLecture instanceof Lecture.Model)) {
        aLecture = new Lecture.Model(aLecture);
        console.log("not inst");
      }

      console.log("adding");
      console.log(aLecture);

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