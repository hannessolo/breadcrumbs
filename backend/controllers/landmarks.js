const Client = require('node-rest-client').Client;
const client = new Client();
const GOOGLE_API_KEY = 'AIzaSyBH-N0mLbH49eQWVXXYZZ8pkOkJAqnRXKk';

exports.landmarks = (req, res) => {
  const lat = req.body.lat;
  const long = req.body.lon;

  var types = 'museum|university|art_gallery';
  var searchString = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
  + lat + ',' + long
    + '&radius=500&type=' + types + '&key=' + GOOGLE_API_KEY;
  var r = [];
  client.get(searchString, '', function (data, response) {
    var locations = data.results;
    if (locations.length == 0) {
      const output = {
        locName: "There are no landmarks",
        locations: []
      }
      res.send();
    } else {
      var address = locations[0].vicinity;

      for (var i = 0; i < locations.length; i++){
        r.push(
          {
            name: locations[i].name,
            placeID : locations[i].place_id,
            lat : locations[i].geometry.location.lat,
            lon : locations[i].geometry.location.lng
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

exports.textLandmarks = (req, res) => {
  const lat = req.body.lat;
  const long = req.body.lon;

  var types = 'point_of_interest';
  var searchString = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?query=Things To See&location='
  + lat + ',' + long
    + '&radius=500&type=' + types + '&key=' + GOOGLE_API_KEY;
  var r = [];
  client.get(searchString, '', function (data, response) {
    var locations = data.results;
    if (locations.length == 0) {
      const output = {
        locName: "There are no landmarks",
        locations: []
      }
      res.send();
    } else {
      var address = locations[0].vicinity;

      for (var i = 0; i < locations.length; i++){
        r.push(
          {
            name: locations[i].name,
            placeID : locations[i].place_id,
            lat : locations[i].geometry.location.lat,
            lon : locations[i].geometry.location.lng
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
