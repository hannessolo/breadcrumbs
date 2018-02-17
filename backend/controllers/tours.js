var fs = require('fs');
const dir = './data/landmarks/';

exports.getTours = (req, res) => {
  var place_id = req.body.placeID;
  if (!fs.existsSync(dir + place_id)){
    const output = {
      tours: []
    }
    res.send(output);
  } else {
    data = fs.readFileSync(dir + place_id + '/entries.json', 'utf-8');
    const output = {
      tours: JSON.parse(data)
    }
    res.send(output);
  }
}

exports.createEntry = (req, res) => {
  const place_id = req.body.placeID;
  const title = req.body.title;
  const audioFile = req.body.file;
  let index;
  var oldData = [];

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

  fs.writeFileSync(dir + place_id + '/' + index + '.m4a', audioFile, 'base64');
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
