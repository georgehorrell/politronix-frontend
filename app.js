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
    
    /*host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME, 
    password: process.env.RDS_PASSWORD, 
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME */
});

mysql_connection.connect();

var data_struct = [];

var time_shift; 

function createPage(req, res, topics, time_frame) {

    console.log("hello"); 
    var query = 'SELECT * FROM data WHERE (topic="'; 

    current_time = Date.now();
    var date = new Date(current_time).toISOString();
    var freq = ')'; 
    switch(time_frame) {
        case 'hour':
            freq += ' AND writeinterval="60" AND datetime BETWEEN "'; 
            time_shift = 60 * 60 * 1000; 
            var first_date = new Date(current_time-time_shift).toISOString();
            freq = freq + first_date + '" AND "' + date + '"'; 
        break; 
        case 'fiveHour': 
            freq += ' AND writeinterval="300" AND datetime BETWEEN "';
            time_shift = 60 * 60 * 1000 * 5;
            var first_date = new Date(current_time-time_shift).toISOString();
            freq = freq + first_date + '" AND "' + date + '"'; 
        break; 
        case 'day': 
            freq += ' AND writeinterval="1200" AND datetime BETWEEN "';
            time_shift = 60 * 60 * 1000 * 24;
            var first_date = new Date(current_time-time_shift).toISOString();
            freq = freq + first_date + '" AND "' + date + '"'; 
        break; 
        case 'week': 
            freq += ' AND writeinterval="8000" AND datetime BETWEEN "';
            time_shift = 60 * 60 * 1000 * 24 * 7;
            var first_date = new Date(current_time-time_shift).toISOString();
            freq = freq + first_date + '" AND "' + date + '"'; 
        break; 
        case 'month':
            freq += ' AND writeinterval="32000" AND datetime BETWEEN "';
            time_shift = 60 * 60 * 1000 * 24 * 7 * 4;
            var first_date = new Date(current_time-time_shift).toISOString();
            freq = freq + first_date + '" AND "' + date + '"'; 
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

    mysql_connection.query(query, function(err, rows, fields) {
        if (err){
            //throw err;
            //above causes server to crash on error, should have better error handling? 
            console.log(err); 
        } 
        var topicCount = 0; 
        for (var i = 0; i < rows.length; i++) {
            if(rows[i].topic == data_struct[topicCount].name) {
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
}


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
    time_frame = 'hour'; 
    topics = ['clinton', 'trump']; 
    createPage(req, res, topics, time_frame); 

}); 
 
 //process on a refresh/call of page graph.pug
app.get('/graph', function(req, res) {
    if(!Array.isArray(req.query.topics)) {
        var topics = [req.query.topics]; 
    }
    else{
        var topics = req.query.topics; 
        topics.sort(); 
    }
    var time_frame = req.query.frame; 
    createPage(req, res, topics, time_frame); 
});

app.get('/index', function(req, res) {
    var graph = pug.renderFile('views/index.pug', { 
            pageTitle: 'Politronix', 
            graph_data: data_struct,
        });
        res.send(graph);
}); 


io.on('connection', function(socket) {

});

server.listen(port, function() {
    console.log("listening on port: " + port);
});
