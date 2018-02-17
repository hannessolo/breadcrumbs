var fs = require('fs');
const dir = './data/landmarks/';

exports.getTours = (req, res) => {
  var location = req.body.loc;
  if (!fs.existsSync(dir + location)){
    res.sendStatus(500);
  }
  data = fs.readFileSync(dir + location + '/entries.json', 'utf-8');
  const output = {
    tours: JSON.parse(data)
  }
  res.send(output);
}

exports.createEntry = (req, res) => {
  const location = req.body.loc;
  const title = req.body.title;
  const audioFile = req.body.file;
  let index;
  var oldData = [];

  if (!fs.existsSync(dir + location)){
    fs.mkdirSync(dir + location);
    index = 0;
  } else {
    entries = fs.readFileSync(dir + location +'/entries.json', 'utf-8');
    oldData = JSON.parse(entries);
    index = oldData.length;
    };

  var entry = {
    id: index,
    title: title,
    filepath: dir + location + '/'+ index + '.mp3',
    rating : 0
  }

  fs.writeFileSync(dir + location + '/' + index + '.mp3', audioFile);
  const fd = fs.openSync(dir + location + '/entries.json', 'w');
    oldData.push(entry);
    fs.writeSync(fd, JSON.stringify(oldData));
    fs.closeSync(fd);
    res.sendStatus(200);
}

function loadFile(location, id) {
    data = fs.readFileSync(dir + location + '/entries.json', 'utf-8');
    data = JSON.parse(data);
    return data;
}

function saveFile(location, id, data) {
  fs.writeFileSync(dir + location + '/entries.json', JSON.stringify(data));
}

exports.upVote = (req, res) => {
  const location = req.params.loc;
  const id = req.params.id;
  let data = loadFile(location, id);
  for (var i = 0; i < data.length; i++){
    if (data[i].id == id){
      data[i].rating += 1;
    }
  }
  saveFile(location, id, data);
  res.sendStatus(200);
}

exports.downVote = (req, res) => {
  const location = req.params.loc;
  const id = req.params.id;
  let data = loadFile(location, id);
  for (var i = 0; i < data.length; i++){
    if (data[i].id == id){
      data[i].rating -= 1;
    }
  }
  saveFile(location, id, data);
  res.sendStatus(200);
}
