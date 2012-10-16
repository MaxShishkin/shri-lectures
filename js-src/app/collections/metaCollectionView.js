define(["jquery" ,"underscore", "backbone", "app/collections/metaCollection"], function ($, _, Backbone, MetaCollection) {

  var MetaCollectionView = function (options) {
    this.metaCollection = options.metaCollection;
    this.CollectionView = options.CollectionView;

    this.views = {};

    Backbone.View.call(this, options);
  }
  _.extend(MetaCollectionView.prototype, Backbone.View.prototype, {
    _configure: function (options) {
      _.isFunction(this.preprocessViewOptions) || (this.preprocessViewOptions = function () {});

      _.each(this.metaCollection.getGroups(), onCollectionCreated, this);

      this.metaCollection.on("collectionCreated", onCollectionCreated, this);
      this.metaCollection.on("collectionRemoved", onCollectionRemoved, this);

      Backbone.View.prototype._configure.call(this, options);
    }
  });

  function onCollectionCreated (collection) {
    var opts = {
      collection: collection
    };

    this.preprocessViewOptions(opts);

    var collectionView = new this.CollectionView(opts);

    this.views[collection.hash] = collectionView;
    this.trigger("collectionCreated");
  };

  function onCollectionRemoved (collection) {
    delete this.views[collection.hash];
    this.trigger("collectionRemoved");
  }

  MetaCollectionView.extend = Backbone.View.extend;

  return MetaCollectionView;

});