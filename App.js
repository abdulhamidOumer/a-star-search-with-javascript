var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var forwarded = require('forwarded-for');
var path = require('path');
var articles=[];
var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    var adress = forwarded(req,req.headers);
    console.log(adress);
    res.sendFile(path.join(__dirname +'/public/search.html'));
});

app.post('/findPath',function(req, res){

    var search = require('./a-star')
    var search_path = search.main;
    
    var mainData = req.body.mainData;
    var source = req.body.source;
    var goal = req.body.goal;
    var the_path = search_path(source, goal, mainData);
    res.send(the_path);
    
});

app.listen(port, function() {
    console.log('App runing on http://localhost:' + port);
});

