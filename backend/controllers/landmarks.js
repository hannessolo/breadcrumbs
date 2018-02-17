const Client = require('node-rest-client').Client;
const client = new Client();
const GOOGLE_API_KEY = 'AIzaSyBH-N0mLbH49eQWVXXYZZ8pkOkJAqnRXKk';

exports.landmarks = (req, res) => {
  const lat = req.body.lat;
  const long = req.body.lon;

  var types = 'university'
  var searchString = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
  + lat + ',' + long
    + '&radius=500&type=' + types + '&key=' + GOOGLE_API_KEY;

  console.log(searchString);
  var r = [];
  client.get(searchString, '', function (data, response) {
    var locations = data.results;
    console.log(locations);
    if (locations.length == 0) {
      const output = {
        locName: "There are no landmarks",
        locations: []
      }
      res.send()
    } else {
      var address = locations[0].vicinity;

      for (var i = 0; i < locations.length; i++){
        console.log(locations[i]);
        r.push(
          {
            name: locations[i].name,
            placeID : locations[i].place_id
          }

        );
      }
      output = {
        locName: address,
        locations: r
      }
      res.json(output);
    }
  });
};
