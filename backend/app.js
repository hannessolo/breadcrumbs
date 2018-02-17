// Module dependency
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Controllers
const landmarkController = require('./controllers/landmarks');
const entryController = require('./controllers/tours');

const app = express();
app.set('port', 8080);
app.use('/static', express.static(path.join(__dirname, 'data')));
app.use(bodyParser.json());

// Takes 'lat', 'long'
app.post('/landmarks', landmarkController.landmarks);

// Takes 'placeID', 'title', 'file'
app.post('/newEntry', entryController.createEntry);

// Takes 'placeID'
app.post('/tours', entryController.getTours);

// Takes nothing
app.post('/tours/:loc/:id/up', entryController.upVote);

// Takes nothing
app.post('/tours/:loc/:id/down', entryController.downVote);

app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:8080');
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
