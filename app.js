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
    
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME, 
    password: process.env.RDS_PASSWORD, 
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME 
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

var data_struct = [];

function clean_mysql_datetime(raw_dt) {
    var year = raw_dt.getFullYear(); 
    var month = raw_dt.getMonth() + 1;  
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
    var query = "SELECT * FROM data WHERE topic='clinton' or topic='trump' ORDER BY topic";

    data_struct[0] = {}
    data_struct[0]['name'] = 'clinton'; 
    data_struct[0]['data_points'] = 0; 
    data_struct[0].x = []; 
    data_struct[0].y = []; 

    data_struct[1] = {}
    data_struct[1]['name'] = 'trump'; 
    data_struct[1]['data_points'] = 0; 
    data_struct[1].x = []; 
    data_struct[1].y = []; 


    mysql_connection.query(query, function(err, rows, fields) {
        if (err){
            //throw err;
            //above causes server to crash on error, should have better error handling? 
            console.log(err); 
        } 
        var topicCount = 0; 
        for (var i = 0; i < rows.length; i++) {
            if(rows[i].topic == data_struct[topicCount].name) {
                //do the stuff
                var dt_clean = clean_mysql_datetime(rows[i].datetime);
                data_struct[topicCount].x[data_struct[topicCount].data_points] = dt_clean; 
                data_struct[topicCount].y[data_struct[topicCount].data_points] = rows[i].score; 
                data_struct[topicCount].data_points++; 
            }
            else {
                topicCount++;
                if(i != rows.length - 1){
                    i--; 
                } 
            }
        }

        var graph = pug.renderFile('views/graph.pug', { 
            pageTitle: 'Politronix', 
            graph_data: data_struct,
        });

        res.send(graph);
        //need to reset data in arrays for each query. will need to thread later on 
        data_struct = [];
    });
}); 
 
 //process on a refresh/call of page graph.pug
app.get('/graph', function(req, res) {
     
    var query = 'SELECT * FROM data WHERE (topic="'; 
   // var topics = req.query.topics.split(' '); 
   if(!Array.isArray(req.query.topics)) {
    var topics = [req.query.topics]; 
   }
   else{
    var topics = req.query.topics; 
    topics.sort(); 
   }
   console.log(req.query.frame);
   var freq = ')'; 
   switch(req.query.frame) {
    case 'hour':
        freq += ' AND writeinterval="60"'; 
    break; 
    case 'fiveHour': 
        freq += ' AND writeinterval="300"'; 
    break; 
    case 'day': 
        freq += ' AND writeinterval="1200"';
    break; 
    case 'week': 
        freq += ' AND writeinterval="8000"';
    break; 
    case 'month':
        freq += ' AND writeinterval="32000"';
    break; 
   }

    for (var i = 0; i < topics.length; i++){
        data_struct[i] = {}; 
        data_struct[i]['name'] = topics[i]; 
        data_struct[i]['data_points'] = 0; 
        data_struct[i].x = []; 
        data_struct[i].y = []; 
        query = query + topics[i] + '"'; 
        if(i != topics.length -1){
            query = query + ' OR topic="'; 
        }
        else{
            query = query + freq + ' ORDER BY topic, datetime'; 
        }
    }
    console.log(query); 
    //data_struct[data_struct.length] = {}; 

    mysql_connection.query(query, function(err, rows, fields) {
        if (err){
            //throw err;
            //above causes server to crash on error, should have better error handling? 
            console.log(err); 
        } 
        var topicCount = 0; 
        for (var i = 0; i < rows.length; i++) {
            if(rows[i].topic == data_struct[topicCount].name) {
                //do the stuff
                var dt_clean = clean_mysql_datetime(rows[i].datetime);
                data_struct[topicCount].x[data_struct[topicCount].data_points] = dt_clean; 
                data_struct[topicCount].y[data_struct[topicCount].data_points] = rows[i].score; 
                data_struct[topicCount].data_points++; 
            }
            else {
                topicCount++;
                if(i != rows.length - 1){
                    i--; 
                } 
            }
        }
        

        var graph = pug.renderFile('views/graph.pug', { 
            pageTitle: 'Politronix', 
            graph_data: data_struct,
        });

        res.send(graph);
        //need to reset data in arrays for each query. will need to thread later on 
        data_struct = [];
    });
});


io.on('connection', function(socket) {

});

server.listen(port, function() {
    console.log("listening on port: " + port);
});
