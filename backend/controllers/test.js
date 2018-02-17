exports.wiki = (req, res) => {
  var wikipedia = require("node-wikipedia");

  wikipedia.page.data("Clifford_Brown", { content: true }, function(response) {
    res.render(response);
});
}
