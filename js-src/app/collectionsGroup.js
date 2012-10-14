define(["underscore"], function (_) {

  var CollectionsGroup = function (Collection, groupBy) {
    this._Collection = Collection;
    this._groupBy = groupBy;
    this._models = {};
    this._collections = {};
    this._modelsCollections = {};
    this._pubsub = {};
  };

  // TODO: Acceps array of models
  CollectionsGroup.prototype.add = function (model) {
    var hash = this.getHash(model),
      collection = this._collections[hash];

    if (!collection) {
      collection = new this._Collection();
    }

    this._models[model.cid] = model;
    this._modelsCollections[model.cid] = hash;

    collection.add(model);

    if (!collection.hash) {
      collection.hash = hash;
      this._collections[hash] = collection;
      this.trigger("collectionCreated", this._collections[hash]);
    }

    model.on("change", this.onModelChange, this);

    return collection;
  }

  CollectionsGroup.prototype.remove = function (model) {
    var hash,
      collection;

    if (this._models[model.cid]) {
      hash = this._modelsCollections[model.cid];
      collection = this._collections[hash];

      delete this._models[model.cid];
      delete this._modelsCollections[model.cid];

      collection.remove(model);
      model.off("change", this.onModelChange)

      if (!collection.length) {
        delete this._collections[hash];
        this.trigger("collectionRemoved", collection);
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

  // TODO: Make new method update instead of calling remove+add
  CollectionsGroup.prototype.onModelChange = function (model) {
    var computedHash = this.getHash(model),
      storedHash = this._modelsCollections[model.cid];

    if (computedHash !== storedHash) {
      this.remove(model);
      this.add(model);
    }
  }

  CollectionsGroup.prototype.getHash = function (model) {
    var hash;

    if (_.isFunction(this._groupBy)) {
      hash = this._groupBy(model);
    } else {
      hash = model.get(this.groupBy);
    }

    return hash;
  }

  CollectionsGroup.prototype.on = function (evt, fn) {
    if (!this._pubsub[evt]) {
      this._pubsub[evt] = [];
    }

    this._pubsub[evt].push(fn);
  }

  // TODO: Implement
  CollectionsGroup.prototype.off = function (evt, fn) {
  }

  CollectionsGroup.prototype.trigger = function (evt) {
    var args = _.rest(arguments);
    if (this._pubsub[evt] && this._pubsub[evt].length) {
      _.each(this._pubsub[evt], function (fn) {
        fn.apply(null, args);
      });
    }
  }

  return CollectionsGroup;
});