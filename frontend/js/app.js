var Router = require('./lib/Router'),
	Home = require('./controllers/Home'),
	currentPage,
	body;
var showPage = function (newPage) {
	if (currentPage) {
		currentPage.teardown();
	};
	currentPage = newPage;
	body.innerHTML = '';
	currentPage.render(body);
}

window.onLoad = function () {
	body = document.querySelector('body');
	Router.add('home', function () {
		var p = new Home();
		showPage(p);
	})
	.add(function () {
		Router.navigate('home');
	})
	.listen()
	.check();
}