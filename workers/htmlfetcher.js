// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
var Promise = require('bluebird');
Promise.promisifyAll(archive);

var htmlFetch = function() {
  return archive.readListOfUrlsAsync()
  .then(function(data) {
    console.log('url list:', data);
    _.each(data, function(url) {
      console.log('current url:', url);
      return archive.isUrlArchivedAsync (url)
      .then( function(isArchived) {
        console.log('is it archived?', isArchived);
        if (!isArchived) {
          return archive.downloadUrlsAsync([url]);
        } 
      });
    });
  });
};
htmlFetch();

// cron command:
//* * * * * /usr/local/bin/node /Users/student/Desktop/web-historian/workers/htmlfetcher.js