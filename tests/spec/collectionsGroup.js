define(["app/helpers", "app/lecture", "app/schedule", "app/collectionsGroup", "jasmine/jasmine-html"],
function (helpers, lecture, schedule, CollectionsGroup) {
  describe("CollectionsGroup", function () {

    var aLecture,
      bLecture,
      cLecture,
      schedulesByDay;

    beforeEach(function () {

      aLecture = new lecture.Model({
        timestamp: new Date().getTime(),
        title: "New awesome lecture",
        lecturer: "Some Dude",
        description: "A lecture on being an awesome dude! Be shure to come!"
      });

      bLecture = new lecture.Model({
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

      schedulesByDay = new CollectionsGroup(schedule.Model, function (model) {
        return helpers.getDateStr(model.getDate());
      });
    });

    it("should do something, but i don't have enough time to write tests ^_^", function () {});

    it("should add models", function () {
      expect(schedulesByDay.getModels().length).toEqual(0);

      schedulesByDay.add(aLecture);
      schedulesByDay.add(bLecture);

      expect(schedulesByDay.getModels().length).toEqual(2);
    });

    it("should group models into collections", function () {
      expect(schedulesByDay.listGroups.length).toEqual(0);

      schedulesByDay.add(aLecture);
      schedulesByDay.add(bLecture);

      expect(schedulesByDay.listGroups().length).toEqual(1);

      schedulesByDay.add(cLecture);

      expect(schedulesByDay.listGroups().length).toEqual(2);
    });

    it("should be able to return collections by hash", function () {
      var hashOne = helpers.getDateStr(aLecture.getDate());
      var hashTwo = helpers.getDateStr(cLecture.getDate());

      schedulesByDay.add(aLecture);
      schedulesByDay.add(bLecture);
      schedulesByDay.add(cLecture);

      var groupOne = schedulesByDay.getGroupByHash(hashOne);
      var groupTwo = schedulesByDay.getGroupByHash(hashTwo);

      expect(groupOne).toEqual(aLecture.collection);
      expect(groupOne).toEqual(bLecture.collection);
      expect(groupTwo).toEqual(cLecture.collection);

      expect(groupOne).not.toEqual(groupTwo);
    });

    it("should be able to remove models", function () {
      expect(schedulesByDay.getModels().length).toEqual(0);

      schedulesByDay.add(aLecture);
      schedulesByDay.add(bLecture);
      schedulesByDay.add(cLecture);

      expect(schedulesByDay.getModels().length).toEqual(3);

      schedulesByDay.remove(aLecture);

      expect(schedulesByDay.getModels().length).toEqual(2);
    });

    it("should remove models also from groups", function () {
      schedulesByDay.add(aLecture);
      schedulesByDay.add(bLecture);
      schedulesByDay.add(cLecture);

      var hashOne = helpers.getDateStr(aLecture.getDate());
      var groupOne = schedulesByDay.getGroupByHash(hashOne);

      expect(groupOne.length).toEqual(2);

      schedulesByDay.remove(bLecture);

      expect(groupOne.length).toEqual(1);
    });

    it("should remove groups when no model left in group", function () {
      schedulesByDay.add(aLecture);
      schedulesByDay.add(bLecture);
      schedulesByDay.add(cLecture);

      expect(schedulesByDay.listGroups().length).toEqual(2);

      schedulesByDay.remove(aLecture);

      expect(schedulesByDay.listGroups().length).toEqual(2);

      schedulesByDay.remove(bLecture);

      expect(schedulesByDay.listGroups().length).toEqual(1);
    });

  });
});