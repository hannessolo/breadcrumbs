const Client = require('node-rest-client').Client;
const client = new Client();
const GOOGLE_API_KEY = 'AIzaSyDJkOfaUfV7oRyQp5D_fKVQBRCkrXwscvA';

exports.landmarks = (req, res) => {
  var lat = req.body.lat;
  var long = req.body.lon;

  var types = 'university'
  var searchString = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
  + lat + ',' + long
    + '&radius=500&type=' + types + '&key=' + GOOGLE_API_KEY;

  var r = [];
  client.get(searchString, '', function (data, response) {
    var locations = data.results;
    var address = data.results[0].vicinity;

    for (var i = 0; i < locations.length; i++){
      console.log(locations[i]);
      r.push(
        locations[i].name
      );
    }
    output = {
      locName: address,
      locations: r
    }
    res.json(output);
  });
};
