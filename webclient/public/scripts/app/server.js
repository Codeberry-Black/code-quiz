var express = require('express');
var app = express();
var gameRooms;

app.use(express.static('../../../public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function  (req, res) {
    res.renderFile('index.html');
});

app.get('/battle', function  (req, res) {
    res.renderFile('game.html');
});

app.get('/fame', function  (req, res) {
    res.renderFile('fame.html');
});

app.get('/languages', function  (req, res) {
    res.renderFile('languages.html');
});

app.get('/feedback', function  (req, res) {
    res.renderFile('feedback.html');
});

app.listen(8000);