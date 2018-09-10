  (function(window) {
  'use strict';
  var App = window.App || {};
  var Promise = window.Promise;
  var data;

  function DataStore() {
    data = {};
  }

  function promiseResolvedWith(value) {
    var promise = new Promise(function (resolve, reject) {
      resolve(value);
    });
    return promise;
  }

  DataStore.prototype.add = function (key, val) {
    data[key] = val;
    return promiseResolvedWith(null);
  };

  DataStore.prototype.get = function (key) {
    return promiseResolvedWith(data[key]);
  };

  DataStore.prototype.getAll = function () {
    return promiseResolvedWith(data);
  };

  DataStore.prototype.remove = function (key) {
    delete data[key];
    return promiseResolvedWith(null);
  };

  App.DataStore = DataStore;
  window.App = App;
})(window);
