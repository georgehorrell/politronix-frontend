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
    host: 'localhost',
    user: 'politronix',
    password: 'sbs456Team',
    database: 'POLITRONIX' 

   /* host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME, 
    password: process.env.RDS_PASSWORD, 
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME*/
});

mysql_connection.connect();

var trace1 = {};
trace1.x = [];
trace1.y = [];
trace1.data = 'scatter';

var trace2 = {}; 
trace2.x = [];
trace2.y = [];
trace2.data = 'scatter';

function clean_mysql_datetime(raw_dt) {
    var year = raw_dt.getFullYear(); 
    var month = raw_dt.getMonth(); 
    if (month < 10){
        month = "0" + month; 
    }
    var day = raw_dt.getDate();
    if (day < 10){
        day = "0" + day; 
    } 
    var hour = raw_dt.getHours(); 
    if (hour < 10){
        hour = "0" + hour; 
    }
    var minute = raw_dt.getMinutes(); 
    if (minute < 10){
        minute = "0" + minute; 
    }
    var seconds = raw_dt.getSeconds();
    if (seconds < 10){
        seconds = "0" + seconds; 
    } 
    var dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;  
    return dateTime; 
}

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/node_modules/smoothie')));

app.get('/', function(req, res) {
    var query = "SELECT * FROM data WHERE topic='clinton' or topic='trump'";

    mysql_connection.query(query, function(err, rows, fields) {
        if (err){
            //throw err;
            //above causes server to crash on error, should have better error handling? 
            console.log(err); 
        } 
        var clintonCount = 0; 
        var trumpCount = 0; 
        for (var i = 0; i < rows.length; i++) {
            var dt_clean = clean_mysql_datetime(rows[i].datetime);
            if(rows[i].topic =='clinton'){
                trace1.x[clintonCount] = dt_clean; 
                trace1.y[clintonCount] = rows[i].score;
                clintonCount++; 
            }
            else{
                trace2.x[trumpCount] = dt_clean; 
                trace2.y[trumpCount] = rows[i].score;
                trumpCount++; 
            }
            
        }

        var graph = pug.renderFile('views/index.pug', { 
            pageTitle: 'Politronix', 
            graph_data: trace1,
            graph_data2: trace2
        });

        res.send(graph);
        //need to reset data in arrays for each query. will need to thread later on 
        trace1.x = [];
        trace1.y = [];
        trace2.x = [];
        trace2.y = [];
    });

    //var index = pug.renderFile('views/index.pug', { pageTitle: 'Politronix' } );
    //res.send(index);
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
            var dt_clean = clean_mysql_datetime(rows[i].datetime);
            trace1.x[i] = dt_clean; 
            trace1.y[i] = rows[i].score;
        }

        var graph = pug.renderFile('views/graph.pug', { 
            pageTitle: 'Politronix', 
            graph_data: trace1,
            topic: req.query.search,
        });
        console.log(req.query.search); 

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
