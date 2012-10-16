define(["underscore"], function (_) {

  var MetaCollection = function (Collection, groupBy) {
    this.Collection = Collection;
    this._groupBy = groupBy;
    this._models = {};
    this._collections = {};
    this._modelsCollections = {};
    this._pubsub = {};
  };

  // TODO: Acceps array of models
  MetaCollection.prototype.add = function (model) {
    var hash = this._getHash(model),
      collection = this._collections[hash];

    if (!collection) {
      collection = new this.Collection();
    }

    this._models[model.cid] = model;
    this._modelsCollections[model.cid] = hash;

    collection.add(model);

    if (!collection.hash) {
      collection.hash = hash;
      this._collections[hash] = collection;
      this.trigger("collectionCreated", this._collections[hash]);
    }

    model.on("change", this._onModelChange, this);
    model.on("destroy", this.remove, this);

    return collection;
  }

  MetaCollection.prototype.remove = function (model) {
    var hash,
      collection;

    if (this._models[model.cid]) {
      hash = this._modelsCollections[model.cid];
      collection = this._collections[hash];

      delete this._models[model.cid];
      delete this._modelsCollections[model.cid];

      collection.remove(model);
      model.off("change", this._onModelChange);
      model.off("destroy", this._onModelChange);

      if (!collection.length) {
        delete this._collections[hash];
        this.trigger("collectionRemoved", collection);
      }
    }
  }

  MetaCollection.prototype.getModels = function () {
    return _.values(this._models);
  }

  MetaCollection.prototype.getGroups = function () {
    return this._collections;
  }

  MetaCollection.prototype.listGroups = function () {
    return _.keys(this._collections);
  }

  MetaCollection.prototype.getGroupByHash = function (hash) {
    return this._collections[hash];
  }

  MetaCollection.prototype.on = function (evt, fn, context) {
    if (!this._pubsub[evt]) {
      this._pubsub[evt] = [];
    }

    this._pubsub[evt].push(function () {
      fn.apply(context, arguments);
    });
  }

  // TODO: Implement
  MetaCollection.prototype.off = function (evt, fn) {
  }

  MetaCollection.prototype.trigger = function (evt) {
    var args = _.rest(arguments);
    if (this._pubsub[evt] && this._pubsub[evt].length) {
      _.each(this._pubsub[evt], function (fn) {
        fn.apply(null, args);
      });
    }
  }

  // TODO: Make new method update instead of calling remove+add
  MetaCollection.prototype._onModelChange = function (model) {
    var computedHash = this._getHash(model),
      storedHash = this._modelsCollections[model.cid];

    if (computedHash !== storedHash) {
      this.remove(model);
      this.add(model);
    }
  }

  MetaCollection.prototype._getHash = function (model) {
    var hash;

    if (_.isFunction(this._groupBy)) {
      hash = this._groupBy(model);
    } else {
      hash = model.get(this.groupBy);
    }

    return hash;
  }

  return MetaCollection;
});