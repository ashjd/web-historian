const fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = require('./http-helpers.js');
// require more modules/folders here!

var handleRequest = function(request, response) {
  if (request.method === 'GET') {
     
    archive.isUrlArchived (request.url.slice(1), function(data) {
      console.log (data, request.url.slice(1));

      if (request.url === '/') {
        fs.readFile('./web/public/index.html', (err, data) => {
          if (err) {
            throw err;
          }
          statusCode = 200;
          response.writeHead(statusCode, headers.headers);
          response.end(data);
        });
      } else if (data) {
        console.log('file path', archive.paths.archivedSites + request.url);
        fs.readFile (archive.paths.archivedSites + request.url, 'utf8', (error, data) => {
          console.log ('data : ', data);
          if (error) {
            throw error;
          }
          statusCode = 200;
          response.writeHead(statusCode, headers.headers);
          response.end(data);
        });
      } else {
        statusCode = 404;
        response.writeHead(statusCode, headers.headers);
        response.end();
      }
    });    
  } else if (request.method === 'POST') {
    request.setEncoding('utf8');
    var postData = '';
    request.on('data', function(chunk) {
      postData += chunk;
    });
    request.on('end', function() {
      console.log('postData:', postData.slice(4), ':end of postData');
      archive.addUrlToList(postData.slice(4) + '\n', function() {
        statusCode = 302;
        response.writeHead(statusCode, headers.headers);
        response.end();
      });
    });
  } 
};

exports.handleRequest = handleRequest;
