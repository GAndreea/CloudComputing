module.exports = function(config) {
  var googleapis = require('googleapis');

  function getAuthenticationUrl() {
    var client = new googleapis.auth.OAuth2(
      config.oauth2.clientId,
      config.oauth2.clientSecret,
      config.oauth2.redirectUrl
    );  
    return client.generateAuthUrl({ scope: ['profile'] }); 
  }

  function getUser(authorizationCode, callback) {
    var client = new googleapis.auth.OAuth2(
    config.oauth2.clientId,
    config.oauth2.clientSecret,
    config.oauth2.redirectUrl
  );  

  client.getToken(authorizationCode, function(err, tokens) {
    if (err) return callback(err);
    client.setCredentials(tokens);
    googleapis.plus('v1').people.get({ userId: 'me', auth: client }, function(err, profile) {
      if (err) return callback(err);
      var user = { 
        id: profile.data.id,
        name: profile.data.displayName,
        imageUrl: profile.data.image.url
      };  
      callback(null, user);
    }); 
  }); 
  }

  return {
    getAuthenticationUrl: getAuthenticationUrl,
    getUser: getUser
  };
};
