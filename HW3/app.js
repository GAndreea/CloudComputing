var config = require('./config');
var photos = require('./poze')(config);
var auth = require('./auth')(config);
var express = require('express');
var multer = require('multer')
var session = require('cookie-session');
var session = require('cookie-session');

var app = express();

app.use(session({ signed: true, secret: config.cookieSecret }));
app.use(express.static('public'));
app.use(multer({ inMemory: true }));
app.use(session({ signed: true, secret: config.cookieSecret }));

app.set('view engine', 'jade');
app.enable('trust proxy');


app.get('/', function(req, res) {
  photos.getAllPhotos(function(err, photos) {
    var keyphotos = photos.map((photo) => Object.assign(photo, { id: photo.id  }));
    res.render('index', { photos: keyphotos, user: req.session.user });
  });
});

app.get('/myLibary', function(req, res) {
  if (! req.session.user) return res.redirect('/');
  photos.getUserPhotos(req.session.user.id, function(err, photos) {
    var keyphotos = photos.map((photo) => Object.assign(photo, { id: photo.id }));
    res.render('index', { photos: keyphotos, user: req.session.user });
  });
});

app.get('/login', function(req, res) {
  var authenticationUrl = auth.getAuthenticationUrl();
  res.redirect(authenticationUrl);
});

app.get('/oauth2callback', function(req, res) {
  auth.getUser(req.query.code, function(err, user) {
    req.session.user = user;
    res.redirect('/');
  });
});

app.get('/logout', function(req, res) {
  req.session = null;
  res.redirect('/');
});

app.post('/photos', function(req, res) {
  var coverImageData;
  if (req.files['cover'])
    coverImageData = req.files['cover'].buffer;

  var userId;
  if (req.session.user)
    userId = req.session.user.id;

  photos.addPhoto(req.body.title, req.body.description, coverImageData, userId, function(err) {
    res.redirect(req.get('Referer') || '/');
  })
});

app.listen(8080);

