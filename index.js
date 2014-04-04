var SubCollection = function(collection, id, subField) {
  var self = this;
  this.subField = subField || '_sub'
  this.collection = collection;
  this.id = id;

  this._map = function(query) {
    query[self.subField] = self.id;
    return query;
  };
};

SubCollection.prototype.aggregate = function(pipeline) {
  pipeline.$match = this._map(pipeline.$match || {});
  return this.collection.aggregate.apply(this.collection, arguments);
};

SubCollection.prototype.count = function(query) {
  if (typeof query === 'function') return this.count(null, query);
  if (!query) query = {};
  this._map(query);
  return this.collection.count.apply(this.collection, arguments);
};

SubCollection.prototype.createIndex = function(keys, options) {
  keys[this.subField] = 1;
  return this.collection.createIndex.apply(this.collection, arguments);
};

SubCollection.prototype.distinct = function(field, query) {
  if (typeof query === 'function') return this.distinct(field, null, query);
  if (!query) query = {};
  this._map(query);
  return this.collection.distinct.apply(this.collection, arguments);
};

SubCollection.prototype.drop = function() {
  return this.collection.drop.apply(this.collection, arguments);
};

SubCollection.prototype.dropIndex = function() {
  return this.collection.dropIndex.apply(this.collection, arguments);
};

SubCollection.prototype.dropIndexes = function() {
  return this.collection.dropIndexes.apply(this.collection, arguments);
};

SubCollection.prototype.ensureIndex = function() {
  return this.collection.ensureIndex.apply(this.collection, arguments);
};

SubCollection.prototype.find = function(query) {
  if (typeof query === 'function') return this.find(null, query);
  if (!query) query = {};
  this._map(query);
  return this.collection.find.apply(this.collection, arguments);
};

SubCollection.prototype.findOne = function(query) {
  if (typeof query === 'function') return this.findOne(null, query);
  if (!query) query = {};
  this._map(query);
  return this.collection.findOne.apply(this.collection, arguments);
};

SubCollection.prototype.findAndModify = function(doc) {
  doc.query = this._map(doc.query || {});
  return this.collection.findAndModify.apply(this.collection, arguments);
};

SubCollection.prototype.getIndexes = function() {
  this.collection.getIndexes.apply(this.collection, arguments);
};

SubCollection.prototype.group = function(doc) {
  if (!doc.cond) doc.cond = {};
  this._map(doc.cond);
  return this.collection.group.apply(this.collection, arguments);
};

SubCollection.prototype.insert = function(docOrDocs) {
  if (Array.isArray(docOrDocs)) docOrDocs.map(this._map);
  else this._map(docOrDocs);
  return this.collection.insert.apply(this.collection, arguments);
};

SubCollection.prototype.isCapped = function() {
  return this.collection.isCapped.apply(this.collection, arguments);
};

SubCollection.prototype.mapReduce = function(map, reduce, opts) {
  if (typeof opts === 'function') return this.mapReduce(map, reduce, null, opts);
  if (!opts) opts = {};
  opts.query = this._map(opts.query || {}) 
  return this.collection.mapReduce.apply(this.collection, arguments);
};

SubCollection.prototype.reIndex = function() {
  return this.collection.reIndex.apply(this.collection, arguments);
};

SubCollection.prototype.remove = function(query, justOne) {
  if (typeof query === 'function') return this.remove(null, query);
  if (!query) query = {};
  this._map(query);
  return this.collection.remove.apply(this.collection, arguments);
};

SubCollection.prototype.runCommand = function() {
  return this.collection.runCommand.apply(this.collection, arguments);
};

SubCollection.prototype.save = function(doc) {
  this._map(doc);
  return this.collection.save.apply(this.collection, arguments);
};

SubCollection.prototype.stats = function() {
  this.collection.stats.apply(this.collection, arguments);
};

SubCollection.prototype.update = function(query, update, opts) {
  if (typeof opts === 'function') return this.update(query, update, null, opts);
  this._map(query);
  update.$set = this._map(update.$set || {});
  return this.collection.update.apply(this.collection, arguments);
};

module.exports = function(collection, id, subField) {
  return new SubCollection(collection, id, subField);
};
