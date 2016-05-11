const fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = require('./http-helpers.js');
// require more modules/folders here!

var handleRequest = function(request, response) {
  if (request.method === 'GET') {
    if (request.url === '/') {
      fs.readFile('./web/public/index.html', (err, data) => {
        if (err) {
          throw err;
        }
        statusCode = 200;
        response.writeHead(statusCode, headers.headers);
        response.end(data);
      });
    }
    
    archive.isUrlArchived (request.url.slice(1), function(data) {
      console.log (data, request.url.slice(1));
      if (data) {
        console.log('file path', archive.paths.archivedSites + request.url);
        fs.readFile (archive.paths.archivedSites + request.url, (error, data) => {
          if (err) {
            throw err;
          }
          statusCode = 200;
          response.writeHead(statusCode, headers.headers);
          response.end(data);
        });
      }
    });    
  }  
};

exports.handleRequest = handleRequest;
