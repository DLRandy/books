var http = require('http'),
	path = require('path'),
	port = 9000,
	host = '127.0.0.1';

    //APIS:Reuqest Api
var Assets = require('./backend/Assets'),
	API = require('./backend/API'),
	Default = require('./backend/Default');

var Router = require('./frontend/js/lib/router')();

Router
.add('static', Assets)
.add('api', API)
.add(Default);

var process = function (req, res) {
	Router.check(req.url, [req, res]);
}

    //http server. that is the entry point of our application,mainly Assets module
    var app = http.createServer(Assets).listen(port, host);
console.log("Listening on " + host + " : " + port);