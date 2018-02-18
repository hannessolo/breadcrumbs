const Client = require('node-rest-client').Client;
const client = new Client();
const textToSpeechAPI = 'ad9f51d8690e4ab0ac046f441a013edd';
const fs = require('fs');
const request = require('request');

function createIntroAudio(loc, placeID){
  const location = loc;
  const place_id = placeID
  let searchString = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=" + location + "&format=json";
  client.get(searchString, '', function (data, response) {
    var values = Object.values(data.query.pages);
    const extract = JSON.stringify(values[0].extract).replace(/<\/?[^>]+(>|$)/g, "").replace(/\\n/g, ' ');

    var searchString = 'http://api.voicerss.org/?key=' + textToSpeechAPI + '&hl=en-us&src=' + extract;

    request
      .get(searchString)
      .on('error', function(err) {
        console.log("Couldn't create intro file");
      })
      .pipe(fs.createWriteStream('./data/landmarks/' + place_id + '/intro.mp3'));
  });
}
