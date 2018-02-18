// Module dependency
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({dest:'./data/temp'});

// Controllers
const landmarkController = require('./controllers/landmarks');
const entryController = require('./controllers/tours');
const testBox = require('./controllers/wiki');

const app = express();
app.set('port', 8080);

jsonParser = bodyParser.json();

app.use('/static', express.static(path.join(__dirname, 'data')));

//app.get('/', jsonParser, testBox.getIntro);
// Takes 'lat', 'long'
app.post('/landmarks', jsonParser, landmarkController.landmarks);

// Takes 'placeID', 'title', 'file'
app.post('/newEntry', upload.single('file'), entryController.createEntry);

// Takes 'placeID'
app.post('/tours', jsonParser, entryController.getTours);

// Takes nothing
app.get('/tours/:placeID/:id/up', entryController.upVote);

// Takes nothing
app.get('/tours/:placeID/:id/down', entryController.downVote);

app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:8080');
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
