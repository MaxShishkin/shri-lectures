define(["app/models/lecture", "app/storage/modelStorage", "jasmine/jasmine-html"],
function (Lecture, ModelStorage) {
  describe("ModelStorage", function () {

    var storage,
      aLecture,
      bLecture,
      cLecture;

    beforeEach(function () {

      aLecture = new Lecture.Model({
        timestamp: new Date().getTime(),
        title: "New awesome lecture",
        lecturer: "Some Dude",
        description: "A lecture on being an awesome dude! Be shure to come!"
      });

      bLecture = new Lecture.Model({
        timestamp: new Date().getTime(),
        title: "New awesome lecture vol. 2",
        lecturer: "Some Dude",
        description: "A lecture on being an awesome dude continues!"
      });

      cLecture = new Lecture.Model({
        timestamp: 7867687,
        title: "Some old lection",
        lecturer: "Old man",
        description: "How to survive for years."
      });

      storage = new ModelStorage("test-cs", Lecture.Model)
      localStorage.removeItem("test-cs");
    });

    it("should accept models to store", function () {
      expect(storage.getStoredItems().length).toEqual(0);

      storage.add(aLecture);

      expect(storage.getStoredItems().length).toEqual(1);

      storage.add(bLecture);

      expect(storage.getStoredItems().length).toEqual(2);
    });

    it("should update localStorage when adding new model", function () {
      expect(localStorage.getItem("test-cs")).toEqual(null);
      storage.add(aLecture);
      expect(localStorage.getItem("test-cs")).not.toEqual(null);

    });

    it("should update own storage on model change event", function () {
      storage.add(aLecture);
      aLecture.set("title", "new title");
      expect(storage.getStoredItems()[0].title).toEqual("new title");
    });

    it("should update localStorage on model change event", function () {
      var oldLS,
        newLS;
      storage.add(aLecture);
      oldLS = localStorage.getItem("test-cs");
      aLecture.set("title", "new title");
      newLS = localStorage.getItem("test-cs")
      expect(newLS).not.toEqual("new title");
    });

    it("should clear own storage when clear method called", function () {
      storage.add(aLecture);
      expect(storage.getStoredItems().length).toEqual(1);
      storage.clear()
      expect(storage.getStoredItems().length).toEqual(0);
    });

    it("should clear localStorage when clear method called", function () {
      storage.add(aLecture);
      expect(localStorage.getItem("test-cs")).not.toEqual(null);
      storage.clear()
      expect(localStorage.getItem("test-cs")).toEqual(null);
    });

    it("should be able to restore from localStorage", function () {
      storage.add(aLecture);
      storage.add(bLecture);

      storage = new ModelStorage("test-cs", Lecture.Model);
      storage.restore();

      expect(storage.getStoredItems().length).toEqual(2);

      expect(storage.getStoredItems()[0].title).toEqual(aLecture.get("title"));
      expect(storage.getStoredItems()[0].timestamp).toEqual(aLecture.get("timestamp"));
      expect(storage.getStoredItems()[1].description).toEqual(bLecture.get("description"));
    });

    it("should remove model from own storage remove method called", function () {
      storage.add(aLecture);
      storage.add(bLecture);

      expect(storage.getStoredItems().length).toEqual(2);

      storage.remove(aLecture);

      expect(storage.getStoredItems().length).toEqual(1);

      expect(storage.getStoredItems()[0].title).toEqual(bLecture.get("title"));
    });

    it("should remove model from localStorage remove method called", function () {
      storage.add(aLecture);
      storage.add(bLecture);

      storage.remove(aLecture);

      storage = new ModelStorage("test-cs", Lecture.Model);
      storage.restore();

      expect(storage.getStoredItems().length).toEqual(1);
      expect(storage.getStoredItems()[0].title).toEqual(bLecture.get("title"));
    });

    it("should not break if localStorage is empty and restoreFromLocalStorage was called", function () {
      storage.restore();

      expect(storage.getStoredItems().length).toEqual(0);
    });
  });
});