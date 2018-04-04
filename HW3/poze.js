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
        if (err) return callback(err);
        callback(null, imageUrl);
      });
    });
    stream.end(image);
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
        if (err) return callback(err);                                            
        poza.data.imageUrl = imageUrl;                                               
        datastore.save(poza, callback);                                           
      }); 
    } else {
      datastore.save(poza, callback);      
    }
  }

  return {
    getAllPhotos: getAllPhotos,
    getUserPhotos: getUserPhotos,
    addPhoto: addPhoto
  };
};
