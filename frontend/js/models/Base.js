// Base.js
var ajax = require('../lib/Ajax');
module.exports = Ractive.extend({
	data: {
		value: null,
		url: ''
	},
	fetch: function () {
		var self = this;
		ajax.request({
			url: self.get('url'),
			json: true
		})
		.done(function(result) {
			console.log("success");
			self.set('value', result);
		})
		.fail(function(xhr) {
			console.log("error");
			self.fire('Error fetching ' + self.get('url'));
		});
		return this;
		
	},
	bindComponent: function (component) {
		if (component) {
			this.observe('value', function (v) {
				for (var key in v) {
					component.set(key, v[key]);
			    };
			}, {init: false});
		};
		return this;
	}
});