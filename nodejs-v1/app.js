var express = require('express');
var mysql = require('mysql');
var path = require('path'); 
 
var server = express();
server.use(express.static(__dirname + '/public'));
var javafunctions = require('./public/javafunctions'); 
 
var port = 10001;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});



/*
///////////////////////////
var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs');
    html = fs.readFileSync('index.html'); 

var path = require('path'); 
var express = require('express');
var app = express();
var pug = require('pug');
app.use(express.static(path.join(__dirname + '/public')));


var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200);
        res.write(html); 
        res.end();
    }
});

var mysql = require('mysql');
//var jav = require('./javafunctions.js').getData(); 


// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/'); 
*/
