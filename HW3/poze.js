const winston = require('winston');
const Logger = winston.Logger;
const Console = winston.transports.Console;

// Imports the Google Cloud client library for Winston
const LoggingWinston = require('@google-cloud/logging-winston').LoggingWinston;

// Creates a Winston Stackdriver Logging client
const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = new Logger({
    level: 'info', // log at 'info' and above
    transports: [
        // Log to the console
        new Console(),
        // And log to Stackdriver Logging
        loggingWinston,
    ],
});


module.exports = function(config) {

  var datastore = require('@google-cloud/datastore')({
      projectId: config.projectId,
      keyFilename: config.keyFilename
  });

  var storage = require('@google-cloud/storage')({
    projectId: config.projectId,
    keyFilename: config.keyFilename
  });

  var bucket = storage.bucket(config.bucketName);

  function getAllPhotos(callback) {
    var query = datastore.createQuery(['Poza']);
    datastore.runQuery(query, callback);       
  }

function uploadImage(image, callback) {
    var imagename = "IMG-" + Math.random();
    var file = bucket.file(imagename);
    var imageUrl = 'https://' + config.bucketName + '.storage.googleapis.com/' + imagename;
    var stream = file.createWriteStream();
    stream.on('error', callback);
    stream.on('finish', function() {
      file.makePublic(function(err) {
        if (err){
            logger.error(err);
            return callback(err);
        }
        callback(null, imageUrl);
      });
    });
    stream.end(image);
      logger.info("Uploaded new image at: " + imageUrl);
  }

  function getUserPhotos(userId, callback) {
    var query = datastore.createQuery(['Poza']).filter('userId', '=', userId);
    datastore.runQuery(query, callback);
  }

   function addPhoto(titlu, descriere, image, userId, callback) {
    var azi = ""+new Date().getTime();
    var poza = {
      key: datastore.key('Poza'),
      data: {
        titlu: titlu,
        descriere: descriere,
        data: azi
      }
    };

      if (userId) {
      poza.data.userId = userId; 
    }
    if (image) {
        uploadImage(image, function(err, imageUrl) {                  
        if (err){
            logger.error(err);
            return callback(err);
        }
        poza.data.imageUrl = imageUrl;                                               
        datastore.save(poza, callback);
      });
    } else {
      datastore.save(poza, callback);      
    }
    logger.info('User ' + userId + " added a new photo: \nTitle - " + titlu + "\nDescription - " + descriere);
  }
}
