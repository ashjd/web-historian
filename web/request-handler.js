const fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
Promise.promisifyAll(archive);
var headers = require('./http-helpers.js');
// require more modules/folders here!

var handleRequest = function(request, response) {
  if (request.method === 'GET') {
     
    return archive.isUrlArchivedAsync (request.url.slice(1))
    .then(function(data) {
     // console.log (data, request.url.slice(1));

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
       // console.log('file path', archive.paths.archivedSites + request.url);
        fs.readFile (archive.paths.archivedSites + request.url, 'utf8', (error, data) => {
       //   console.log ('data : ', data);
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
   //   console.log('postData:', postData.slice(4), ':end of postData');
      var url = postData.slice(4);
      return archive.isUrlArchivedAsync(url)
      .then(function(isArchived) {
        if (isArchived) {
          fs.readFile(archive.paths.archivedSites + '/' + url, (err, data) => {
            if (err) {
              throw err;
            }
            statusCode = 302;
            response.writeHead(statusCode, headers.headers);
            response.end(data);  
          });
        } else {
          return archive.addUrlToListAsync(url + '\n')
          .then( function() {
            console.log('loading page:', archive.paths.siteAssets + '/loading.html');
            fs.readFile(archive.paths.siteAssets + '/loading.html', (err, data) => {
              if (err) {
                throw err;
              }
              statusCode = 302;
              response.writeHead(statusCode, headers.headers);
              response.end(data);              
            });
          });
        }
      });
    });
  } 
};

exports.handleRequest = handleRequest;
