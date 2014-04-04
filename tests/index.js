var test = require('tape');
var fixtures = require('./fixtures');
var mongojs = require('mongojs');
var db = mongojs('test', ['beers']);
var sub = require('../index');

test('aggregate should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DO', 'country');
    var beersDk = sub(db.beers, 'DK', 'country');

    beers.aggregate({}, {$group: {_id: '$type'}}, function(err, types) {
      t.equal(types.length, 1);
      t.equal(types[0]._id, 'Pilsener');
      t.end();
    });
  });
});

test('count should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DO', 'country');
    var beersDk = sub(db.beers, 'DK', 'country');

    beers.count(function(err, n) {
      t.equal(n, 2);
      beersDk.count({type: 'Pilsener'}, function(err, m) {
        t.equal(m, 2);
        t.end();
      });
    });
  });
});

test('distinct should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DO', 'country');
    var beersDk = sub(db.beers, 'DK', 'country');

    beers.distinct('type', function(err, types) {
      t.equal(types[0], 'Pilsener');
      t.equal(types.length, 1);

      beersDk.distinct('type', function(err, types) {
        t.equal(types[0], 'Pilsener');
        t.equal(types[1], 'Ale');
        t.equal(types.length, 2);
        t.end();
      });
    });
  });
});

test('find should work', function(t) {
  t.plan(3);
  fixtures.load(function() {
    var beers = sub(db.beers, 'DO', 'country');
    beers.find(function(err, beers) {
      t.equal(beers[0].name, 'Presidente');
    });

    var beersDk = sub(db.beers, 'DK', 'country');
    beersDk.find().skip(1, function(err, beers) {
      t.equal(beers[0].name, 'Tuborg');
      beersDk.find({type: 'Ale'}, function(err, ales) {
        t.equal(ales[0].name, 'Ale no. 17');
      });
    });
  });
});

test('findOne should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DO', 'country');
    beers.findOne(function(err, beer) {
      t.equal(beer.name, 'Presidente');
      t.end();
    });
  });
});

test('insert should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DK', 'country');
    beers.insert({name:'Albani'}, function(err, beer) {
      t.equal(beer.country, 'DK');
      t.end();
    });
  });
});

test('remove should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DK', 'country');
    beers.remove(function() {
      db.beers.count(function(err, n) {
        t.equal(n, 2);
        t.end();
      });
    });
  });
});

test('save should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DK', 'country');
    beers.save({name:'Albani'}, function(err, beer) {
      t.equal(beer.country, 'DK');
      t.end();
    });
  });
});

test('update should work', function(t) {
  fixtures.load(function() {
    var beers = sub(db.beers, 'DK', 'country');
    beers.update({type: 'Pilsener'}, {$set: {type: 'pilsener'}}, function() {
      db.beers.findOne({_id: 1}, function(err, carl) {
        t.equal(carl.type, 'pilsener');
        db.beers.findOne({_id: 4}, function(err, carl) {
          t.equal(carl.type, 'Pilsener');
          t.end();
        });
      });
    });
  });
});

test('end', function(t) {
  t.end();
  process.exit(0);
})
