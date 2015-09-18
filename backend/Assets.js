// Assets.js
//request handler.
//mainly to read files from the hard disk and serve it to users


//req.url points ot the current request paht
//ex. the current request: http://localhost:9000/static/css/style.css
//    the req.url: /static/css/style.css

	
	//chekcing whether the file exists and if not,
	// sending a proper message
	//error code: 4XX points to client error
	//			  5XX points to server error

	

	// Sending the file's content to the browser with 
	// correct content type
	//the parameter file object has ext and content
	
var fs = require('fs');
var path = require('path');
var files = {};

module.exports = function(req, res) {

  var sendError = function(message, code) {
    res.writeHead(code || 404, {'Content-Type': 'text/html'});
    res.end(message);
  }

  var serve = function(file) {
    var contentType;
    switch(file.ext) {
      case "css": contentType = "text/css"; break;
      case "html": contentType = "text/html"; break;
      case "js": contentType = "application/javascript"; break;
      case "ico": contentType = "image/ico"; break;
      case "json": contentType = "application/json"; break;
      case "jpg": contentType = "image/jpeg"; break;
      case "jpeg": contentType = "image/jpeg"; break;
      case "png": contentType = "image/png"; break;
      default: contentType = "text/plain";
    }
    res.writeHead(200, {'Content-Type': contentType});
    res.end(file.content + '\n');
  }

  var readFile = function(filePath) {
    fs.exists(filePath, function(exists) {
      if(exists && files[filePath] && false) {
          serve(files[filePath]);
      } else if(exists) {
        fs.readFile(filePath, function(err, data) {
          if(err) {
            sendError('Error reading ' + filePath + '.');
            return;
          }
          files[filePath] = {
            ext: filePath.split(".").pop().toLowerCase(),
            content: data
          };
          serve(files[filePath]);
        });
      } else {
        sendError('File ' + req.url + ' does not exist.')
      }
    });
  }

  readFile(path.normalize(__dirname + '/..' + req.url));

}
