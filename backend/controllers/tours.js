const dir = './data/landmarks/';
const Client = require('node-rest-client').Client;
const client = new Client();
const textToSpeechAPI = 'd5537ddec597441e982b802e882dfc44';
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
        filepath: 'landmarks/' + place_id + '/intro.mp3',
        rating: 0
      }]
    }

    var prm1 = new Promise((res, rej) => {
      createIntroAudio(loc, place_id, 200, (isTrue) => {
        res(isTrue);
      });
    });
    prm1.then((isNotEmpty) => {
      if (isNotEmpty){
        console.log("Waited")
        fs.writeFileSync(dir + place_id +'/entries.json', JSON.stringify([{
          id: 'intro',
          title: '[Generated] Basic tour',
          filepath: 'landmarks/' + place_id + '/intro.mp3',
          rating: 0
        }]));
        res.send(output);
      } else {
        console.log("Didnt wait wtf? "+ isNotEmpty);
        output = {
          tours:[]
        }
        fs.writeFileSync(dir + place_id +'/entries.json', JSON.stringify([]));
        res.send(output);
      }

    });
  } else {
    data = fs.readFileSync(dir + place_id + '/entries.json', 'utf-8');
    output = {
      tours: JSON.parse(data)
    }
    fs.writeFileSync(dir + place_id +'/entries.json', JSON.stringify(output.tours));
    res.send(output);
  }
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

function createIntroAudio(loc, placeID, wordLimit, callback){
  const location = loc;
  const place_id = placeID;
  let searchString = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=" + location + "&format=json";

  client.get(searchString, '', function (data, response) {
    var values = Object.values(data.query.pages);
    if (values[0].extract == undefined){
      console.log("Null value?");
      callback (false);
    } else {
    let extract = JSON.stringify(values[0].extract).replace(/<\/?[^>]+(>|$)/g, "").replace(/\\n/g, ' ');
    extract = WordCount(extract, wordLimit);

    var musicLink = 'http://api.voicerss.org/?key=' + textToSpeechAPI + '&hl=en-us&src=' + extract;
    client.get(musicLink, '', function(data, response) {
      fs.writeFileSync('./data/landmarks/' + place_id + '/intro.mp3', data);
      if (fs.statSync('./data/landmarks/' + place_id + '/intro.mp3').size < 10000){
        console.log(data);
        fs.unlinkSync('./data/landmarks/' + place_id + '/intro.mp3');
        callback(false);
      } else {
        callback (true);
      }
    })}
  });
}

function WordCount(str, wordCount) {
  let output = str.split(" ").slice(0,wordCount);
  for (let i = output.length - 1; i >= 0; i--) {
    if (output[i].endsWith('.')){
      return output.slice(0, i + 1).join(' ');
    }
  }
}
