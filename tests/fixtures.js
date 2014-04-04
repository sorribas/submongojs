var mongojs = require('mongojs');
var db = mongojs('test', ['beers']);
var ObjectId = db.ObjectId;

exports.load = function(cb) {
  db.beers.remove(function() {
    db.beers.insert([
      { _id : 1, country : 'DK', name : 'Carlsberg', type : 'Pilsener' },
      { _id : 2, country : 'DK', name : 'Tuborg', type : 'Pilsener' },
      { _id : 3, country : 'DK', name : 'Ale no. 17', type : 'Ale' },
      { _id : 4, country : 'DO', name : 'Presidente', type : 'Pilsener' },
      { _id : 5, country : 'DO', name : 'Bohemia', type : 'Pilsener' }
    ], function(err) {
      if (err) throw err;
      cb();
    });
  });
};
