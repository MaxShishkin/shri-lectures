define(["underscore"], function (_) {

  var CollectionsGroup = function (Collection, groupBy) {
    this._Collection = Collection;
    this._groupBy = groupBy;
    this._models = {};
    this._collections = {};
    this._modelsCollections = {};
  };

  CollectionsGroup.prototype.add = function (model) {
    var hash;

    if (_.isFunction(this._groupBy)) {
      hash = this._groupBy(model);
    } else {
      hash = model.get(this.groupBy);
    }

    if (!this._collections[hash]) {
       this._collections[hash] = new this._Collection();
    }

    this._models[model.cid] = model;
    this._collections[hash].add(model);
    this._modelsCollections[model.cid] = hash;
  }

  CollectionsGroup.prototype.remove = function (model) {
    var hash;

    if (this._models[model.cid]) {
      hash = this._modelsCollections[model.cid];

      delete this._models[model.cid];
      delete this._modelsCollections[model.cid];

      this._collections[hash].remove(model);

      if (!this._collections[hash].length) {
        delete this._collections[hash];
      }
    }
  }

  CollectionsGroup.prototype.getModels = function () {
    return _.values(this._models);
  }

  CollectionsGroup.prototype.getGroups = function () {
    return this._collections;
  }

  CollectionsGroup.prototype.listGroups = function () {
    return _.keys(this._collections);
  }

  CollectionsGroup.prototype.getGroupByHash = function (hash) {
    return this._collections[hash];
  }

  return CollectionsGroup;
});