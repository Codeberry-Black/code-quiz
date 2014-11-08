var express = require('express');
var app = express();

app.use(express.static('../../../public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function  (req, res) {
    res.renderFile('index.html');
});

app.listen(8000);