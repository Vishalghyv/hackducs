//Imports
var express = require('express')
var cors = require('cors')
var bodyparser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')

var route = require('./route')
var app = express();
//Constants
const hostname = '127.0.0.1';
const port = 5000;



//Moongoose
// mongoose.connect(url);
// mongoose.connection.on('connected',() =>{
//   console.log("Connection made to mongodb @ 27017")
// })

//Routing
app.use(cors());
app.use(bodyparser.json())


// app.use('/',route)
// Finalizing
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
