(function (window) {
	'use strict';

	var App = window.App || {};
	var $ = window.jQuery;

	function RemoteDataStore(url) {
		if (!url) {
			throw new Error('No remote URL supplied.');
		}

		this.checkAccess = $.get(url);
		this.serverUrl = url;
	}

	RemoteDataStore.prototype.add = function (key, val) {
		return $.post(this.serverUrl, val, function (serverResponce) {
			console.log(serverResponce);
		});
	}

	RemoteDataStore.prototype.getAll = function (cb) {
		return $.get(this.serverUrl, function (serverResponce) {
			if (cb) {
				console.log(serverResponce);
				cb(serverResponce);
			}
		})
	}

	RemoteDataStore.prototype.get = function (key, cb) {
		return $.get(this.serverUrl + '/' + key, function (serverResponce) {
			if (cb) {
				console.log(serverResponce);
				cb(serverResponce);
			}
		});
	}

	RemoteDataStore.prototype.remove = function (key, cb) {
		return $.ajax(this.serverUrl + '/' + key, {
			type: 'DELETE'
		});
	}

	App.RemoteDataStore = RemoteDataStore;
	window.App = App;

})(window);