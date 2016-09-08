/* app.js
 * ------
 * Date:   07.12.16
 * Author: George Horrell
 * ----------------------
 * Point of access for the politronix web app.
 */

var port = process.env.PORT || 3000;
var http = require('http');
var express = require('express');
var path = require('path');
var pug = require('pug');
var mysql = require('mysql');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var mysql_connection = mysql.createConnection({
    /*host: 'localhost',
    user: 'politronix',
    password: 'sbs456Team',
    database: 'POLITRONIX' */

    /*host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME, 
    password: process.env.RDS_PASSWORD, 
    port: process.env.RDS_PORT */

    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME, 
    password: process.env.RDS_PASSWORD, 
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
});

mysql_connection.connect(function(err) {
    if (err) {
        console.log("Big time connect error");
        console.log(err);
        throw err;
    }
});

var trace1 = {};
trace1.x = [];
trace1.y = [];
trace1.data = 'scatter';

function clean_mysql_datetime(raw_dt) {
    var date = raw_dt.substr(0, 10);
    var time = raw_dt.substr(11, 20);
    return date + " " + time;
}

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res) {
    var index = pug.renderFile('views/index.pug', { pageTitle: 'Politronix' } );
    res.send(index);
}); 
 
 //process on a refresh/call of page graph.pug
app.get('/graph', function(req, res) {

    var query = 'SELECT * FROM data WHERE topic="' + req.query.search + '"'; 
    mysql_connection.query(query, function(err, rows, fields) {
        if (err){
            //throw err;
            //above causes server to crash on error, should have better error handling? 
            console.log(err); 
        } 
        for (var i = 0; i < rows.length; i++) {
            var dt_clean = clean_mysql_datetime(rows[i].datetime.toString());
            trace1.x[i] = dt_clean; 
            trace1.y[i] = rows[i].score;
        }

        var graph = pug.renderFile('views/graph.pug', { 
            pageTitle: 'Politronix', 
            graph_data: trace1,
        });

        res.send(graph);
        //need to reset data in arrays for each query. will need to thread later on 
        trace1.x = [];
        trace1.y = [];
    });
});


io.on('connection', function(socket) {

});

server.listen(port, function() {
    console.log("listening on port: " + port);
});
