define(["underscore", "backbone"], function (_, Backbone) {

  var CollectionStorage = function (name) {
    this.name = name;
    this._storage = {};
  };

  CollectionStorage.prototype.add = function (model) {
    if (!this._storage[model.cid]) {
      this._storage[model.cid] = model.toJSON();
      model.on("change", this.update, this);
      this.saveToLocalStorage();
    }
  };

  CollectionStorage.prototype.remove = function (model) {
    if (this._storage[model.cid]) {
      delete this._storage[model.cid];
      this.saveToLocalStorage();
    }
  };

  CollectionStorage.prototype.update = function (model) {
    this._storage[model.cid] = model.toJSON();
    this.saveToLocalStorage();
  };

  CollectionStorage.prototype.clear = function () {
    this._storage = {};
    localStorage.removeItem(this.name);
  };

  CollectionStorage.prototype.getStoredItems = function () {
    return _.values(this._storage);
  };

  CollectionStorage.prototype.saveToLocalStorage = function () {
    var json = JSON.stringify(this.getStoredItems());
    localStorage.setItem(this.name, json);
  };

  CollectionStorage.prototype.restoreFromLocalStorage = function () {
    var ls = localStorage.getItem(this.name);
    if (ls) {
      this._storage = JSON.parse(ls);
    }
  };

  return CollectionStorage;
});