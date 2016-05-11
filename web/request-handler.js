const fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = require('./http-helpers.js');
// require more modules/folders here!

var handleRequest = function(request, response) {
  if (request.method === 'GET' && request.url === '/') {
    fs.readFile('./web/public/index.html', (err, data) => {
      if (err) {
        throw err;
      }
      statusCode = 200;
      response.writeHead(statusCode, headers.headers);
      response.end(data);
    });
  }  
};

exports.handleRequest = handleRequest;
