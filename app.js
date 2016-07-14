/* app.js
 * ------
 * Date:   07.12.16
 * Author: George Horrell
 * ----------------------
 * Point of access for the politronix web app.
 */

var port = 8081;
var http = require('http');
var express = require('express');
var path = require('path');
var pug = require('pug');
var parse = require('csv-parse');
var fs = require('fs');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res) {
    var index = pug.renderFile('views/index.pug', { pageTitle: 'politronix' } );
    res.send(index);
});

io.on('connection', function(socket) {

});

server.listen(port, function() {
    console.log("listening on port: " + port);
});
