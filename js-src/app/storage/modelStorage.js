define(["underscore", "backbone"], function (_, Backbone) {

  var ModelStorage = function (name, Model) {
    this.name = name;
    this.Model = Model;
    this._storage = {};
    this._models = {};
  };

  ModelStorage.prototype.add = function (model) {
    this._add(model, true);
  };

  ModelStorage.prototype._add = function (model, saveToLS) {
    if (!this._checkModel(model)) {
      return;
    }

    if (!this._storage[model.cid]) {
      this._storage[model.cid] = model.toJSON();
      this._models[model.cid] = model;
      model.on("change", this.update, this);
      if (saveToLS) {
        this._saveToLocalStorage();
      }
    }
  };

  ModelStorage.prototype.remove = function (model) {
    if (!this._checkModel(model)) {
      return;
    }

    if (this._storage[model.cid]) {
      delete this._storage[model.cid];
      delete this._models[model.cid];
      this._saveToLocalStorage();
    }
  };

  ModelStorage.prototype.update = function (model) {
    if (!this._checkModel(model)) {
      return;
    }

    this._storage[model.cid] = model.toJSON();
    this._saveToLocalStorage();
  };

  ModelStorage.prototype.clear = function () {
    this._storage = {};
    this._models = {};
    localStorage.removeItem(this.name);
  };

  ModelStorage.prototype.getStoredItems = function () {
    return _.values(this._storage);
  };

  ModelStorage.prototype.getModels = function () {
    return _.values(this._models);
  };

  ModelStorage.prototype.restore = function () {
    var ls = localStorage.getItem(this.name);

    if (!ls) {
      return;
    }

    try {
      ls = JSON.parse(ls);
    } catch (e) {
      return; // return false ?
    }

    _.each(ls, function (data) {
      this._add(new this.Model(data), false);
    }, this);
  };

  ModelStorage.prototype.toJSON = function () {
    return JSON.stringify(this.getStoredItems());
  };

  ModelStorage.prototype._saveToLocalStorage = function () {
    localStorage.setItem(this.name, this.toJSON());
  };

  ModelStorage.prototype._checkModel = function (model) {
    return (model instanceof this.Model);
  };

  return ModelStorage;
});
