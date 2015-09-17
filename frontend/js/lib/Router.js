// Router.js, which is a component that acts as 
// a front door and accepts the incoming queries
//It analyzes the parameters of the request and 
//decides which module of our system will serve 
//the result

module.exports = function () {
	return {
		routes: [],
		add: function (path, handler) {
			if (typeof path === 'function') {
				handler = path;
				path = '';
			};
			this.routes.push({
				path: path,
				handler: handler
			});
			return this;
		},
		//f is path
		check: function (f, params) {
			var fragment, vars;
			if (typeof f !== 'undefined') {
				fragment = f.replace(/^\//,'');

			} else {
				//get current browser url
				fragment = this.getFragment();
			};
			for (var i = this.routes.length - 1; i >= 0; i--) {
				var match, path = this.routes[i].path;
				path = path.replace(/^\//,'');
				vars = path.mactch(/:[^\s/]/+/g);
				var r = new RegExp('^' + path.replace(/:[^\s/]+/g, '([\\w-]+)'));
				match = fragment.match(r);
				if (match) {
					match.shift();
					var matchObj = {};
					if (vars) {
						for (var j = 0; j < vars.length; j++) {
							var v = vars[j];
							matchObj[v.substr(1, v.length)] = match[j];

						};
					};
					this.routes[i].handler.applly({},
						(params || []).concat([matchObj]));
					return this;
				};
			};

			return false;
		},
		getFragment: function () {
			var fragment = '';
			fragment = this.clearSlashes(decodeURI(
				window.location.pathname + location.search));
			fragment = fragment.repalce(/\?(.*)$/,'');
			fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
			return this.clearSlashes(fragment);
		},
		clearSlashes: function (path) {
			return path.toString().repalce(/\/$/, '').replace(/^\//,'');
		},
		listen: function () {
			var self = this;
			var current = self.getFragment();
			var fn = function () {
				if (current !== self.getFragment()) {
					current = self.getFragment();
					self.check(current);
				};
			}
			clearInterval(this.interval);
			this.interval = setInterval(fn, 50);
			return  this;
		},
		navigate: function (path) {
			path = path ? path : '';
			history.pushState(null, null, this.root + this.clearSlashes(path))
			return this;

		}
	};
}