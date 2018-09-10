(function (window) {
	'use strict';

	var App = window.App || {};

	var Validation = {
		remoteDS: false,

		isCompanyEmail: function (email) {
			return /.+@gcs\.ru$/.test(email);
		},
		remoteCheckEmail: function (email) {
			Validation.remoteDS.get(email, function(serverResponce){
				if(!serverResponce)
					return true;
				else
					return false;
			});
		},
	};

	App.Validation = Validation;
	window.App = App;

})(window);