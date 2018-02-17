// Module dependency
const express = require('express');
const bodyParser = require('body-parser');

// Controllers
const homeController = require('./controllers/home');
const landmarkController = require('./controllers/landmarks');
const entryController = require('./controllers/tours');

const app = express();
app.set('port', 8080);
app.use(express.static('./data'));
app.use(bodyParser.json());

app.post('/landmarks', landmarkController.landmarks);
app.post('/newEntry', entryController.createEntry);
app.post('/tours', entryController.getTours);
app.post('/tours/:loc/:id/up', entryController.upVote);
app.post('/tours/:loc/:id/down', entryController.downVote);

app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:8080');
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
