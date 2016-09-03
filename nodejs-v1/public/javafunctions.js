//var exports = module.exports={}; 
var express = require('express');

exports.getData = function (){
    var mysql = require('mysql');
   // console.log("connected to the app"); 
    var connection = mysql.createConnection({
        /* host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME, 
        password: process.env.RDS_PASSWORD, 
        port: orcess.env.RDS_PORT*/
    
        host: 'localhost',
        user: 'politronix', 
        password: 'sbs456Team', 
        database : 'POLITRONIX'
        //port: orcess.env.RDS_PORT
    }); 

    connection.connect();

    var rows_result; 
     
 
    var query = connection.query('SELECT * FROM data WHERE topic = ?',['clinton'], function(err, rows, fields) {
    if (!err){
        //console.log('The solution is: ', rows);
        processFEData(rows); 
    }
    else{
        console.log('Error while performing Query.');
    }
    }); 
 
    connection.end();
};

function processFEData(data) {
    console.log(data); 
}
 



