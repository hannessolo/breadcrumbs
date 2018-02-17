const Client = require('node-rest-client').Client;
const client = new Client();

exports.getIntro = (req, res) => {
  const location = req.query.loc;
  let searchString = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=" + location + "&format=json";
  client.get(searchString, '', function (data, response) {
    var values = Object.values(data.query.pages);
    console.log(JSON.stringify(values[0].extract));
  });
}
