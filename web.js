var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(geteDataFromFile);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

function getDataFromFile(){
    var fs= require('fs');
    var data = fs.readFileSync('index.html');
    return data;
}
