const dir = './data/landmarks/';
const Client = require('node-rest-client').Client;
const client = new Client();
const textToSpeechAPI = 'ad9f51d8690e4ab0ac046f441a013edd';
const fs = require('fs');
var request = require('request');

exports.getTours = (req, res) => {
  const place_id = req.body.placeID;
  const loc = req.body.placeName;
  let output;
  if (!fs.existsSync(dir + place_id)){
    fs.mkdirSync(dir + place_id);
    output = {
      tours: [{
        id: 'intro',
        title: '[Generated] Basic tour',
        filepath: dir + place_id + '/intro.mp3',
        rating: 0
      }]
    }

    createIntroAudio(loc, place_id);
  } else {
    data = fs.readFileSync(dir + place_id + '/entries.json', 'utf-8');
    output = {
      tours: JSON.parse(data)
    }
  }
  fs.writeFileSync(dir + place_id +'/entries.json', JSON.stringify(output.tours));
  res.send(output);
}

exports.createEntry = (req, res) => {
  const place_id = req.get('placeID');
  const title = req.get('tourTitle');
  let index;
  var oldData = [];
  const fileName = fs.readdirSync('./data/temp/')[0];

  if (!fs.existsSync(dir + place_id)){
    fs.mkdirSync(dir + place_id);
    index = 0;

  } else {
    if (!fs.existsSync(dir + place_id + '/entries.json')){
      fs.writeFileSync(dir + place_id +'/entries.json', []);
      index = 0;
    }
    entries = fs.readFileSync(dir + place_id +'/entries.json', 'utf-8');
    oldData = JSON.parse(entries);
    index = oldData.length;
  };

  var entry = {
    id: index,
    title: title,
    filepath: 'landmarks/' + place_id + '/'+ index + '.m4a',
    rating : 0
  }
  fs.copyFileSync('./data/temp/' + fileName, dir + place_id + '/' + index + '.m4a');
  fs.unlinkSync('./data/temp/' + fileName);
  const fd = fs.openSync(dir + place_id + '/entries.json', 'w');
  oldData.push(entry);
  fs.writeSync(fd, JSON.stringify(oldData));
  fs.closeSync(fd);
  res.sendStatus(200);
}

function loadFile(place_id, id) {
  data = fs.readFileSync(dir + place_id + '/entries.json', 'utf-8');
  data = JSON.parse(data);
  return data;
}

function saveFile(place_id, id, data) {
  fs.writeFileSync(dir + place_id + '/entries.json', JSON.stringify(data));
}

exports.upVote = (req, res) => {
  const place_id = req.params.placeID;
  const id = req.params.id;
  let data = loadFile(place_id, id);
  for (var i = 0; i < data.length; i++){
    if (data[i].id == id){
      data[i].rating += 1;
    }
  }
  saveFile(place_id, id, data);
  res.sendStatus(200);
}

exports.downVote = (req, res) => {
  const place_id = req.params.placeID;
  const id = req.params.id;
  let data = loadFile(place_id, id);
  for (var i = 0; i < data.length; i++){
    if (data[i].id == id){
      data[i].rating -= 1;
    }
  }
  saveFile(place_id, id, data);
  res.sendStatus(200);
}

function createIntroAudio(loc, placeID){
  const location = loc;
  const place_id = placeID;
  let searchString = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=" + location + "&format=json";
  client.get(searchString, '', function (data, response) {
    var values = Object.values(data.query.pages);
    let extract = JSON.stringify(values[0].extract).replace(/<\/?[^>]+(>|$)/g, "").replace(/\\n/g, ' ');
    extract = WordCount(extract);

    var musicLink = 'http://api.voicerss.org/?key=' + textToSpeechAPI + '&hl=en-us&src=' + extract;
    client.get(musicLink, '', function(data, response) {
      data.length;
      console.log(musicLink);
      fs.writeFileSync('./data/landmarks/' + place_id + '/intro.mp3', data);
      return;
    })
  });
}

function WordCount(str) {
  return str.split(" ").slice(0,200).join(' ');
}
