# submongojs

sub-sections of mongodb databases with [mongojs](https://github.com/mafintosh/mongojs)

[![build status](https://secure.travis-ci.org/sorribas/submongojs.png)](http://travis-ci.org/sorribas/submongojs)

## What?

Ok. So let's say you're building a personal finance app for many customers, two of which are Alice and Bob.
You have to be very careful not to show Alice's expenses on Bob's account, so you MUST always remember to
filter by `account_id` or such. Or you can use this module as following.

```js
var mongojs = require('mongojs');
var submongojs = require('submongojs');

var db = mongojs('myapp', ['expenses']);

// ...

var accountId = getIdSomehow();
var expenses = submongojs(db.expenses, accountId, 'account_id');

// Then from here on, we just use the mongojs API

expenses.find({active: true}).limit(10, function(err, exps) {
  send(exps);
});

```

## Install

`npm install submongojs`

## API

The module is just one function.

`submongojs(collection, idvalue, [idFieldName])`

Then afterwards, you just need to use the mongojs collection API.

## License

MIT
