// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

var htmlFetch = function() {
  archive.readListOfUrls(function(data) {
    console.log('url list:', data);
    _.each(data, function(url) {
      console.log('current url:', url);
      archive.isUrlArchived (url, function(isArchived) {
        console.log('is it archived?', isArchived);
        if (!isArchived) {
          archive.downloadUrls([url]);
        } 
      });
    });
  });
};
htmlFetch();