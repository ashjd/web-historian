var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(error, data) {
    if (error) {
      throw error;
    }
   // console.log('data', data);
    data = data.split('\n');
    return callback(data);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls (function (data) {
    if (data.indexOf(url) !== -1) {
      return callback(true);
    } else {
      return callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList (url, function (data) {
    if (!data) {
      fs.appendFile (exports.paths.list, url, (err) => {
        if (err) {
          throw err;
        }
      //  console.log ('appended url');
        callback();
      });
    } 
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(error, data) {
    if (error) {
      throw error;
    }
    if (data.indexOf(url) !== -1) {
      return callback(true);
    } else {
      return callback(false);
    }

  });
};

exports.downloadUrls = function(urlArray) {
  _.each(urlArray, function(url) {
    //console.log ('url = ', url);
    var options = {
      host: url,
      method: 'GET'
    };

    var req = http.request(options, (res) => {
      //console.log ('inside GET request');
      res.setEncoding('utf8');
      var content = '';
      res.on('data', (chunk) => {
        //console.log('chunk = ', chunk);
        content += chunk;
      });
      res.on('end', () => {
        //console.log ('content = ', content);
        fs.writeFile (exports.paths.archivedSites + '/' + url, content, 'utf8', function(error) {
          if (error) {
            throw error;
          }
        });
      });
    });
    req.on('error', (e) => {
      //console.log ('request error : ', e.message);
    });
    req.end(); 
  });
};
