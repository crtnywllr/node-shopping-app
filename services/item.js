var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name }, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.update = function(id, updatedName, callback, errback) {
   Item.findOneAndUpdate({_id: id}, {name: updatedName},  function(err, item) {
            if (err) {
          errback(err);
            return;
        }
      callback(item);
    });
};

exports.remove = function(id, callback, errback) {
    Item.findOneAndRemove({_id: id}, function(err, item) {
        if (err) {
          errback(err);
            return;
        }
      callback(item);
    });
};