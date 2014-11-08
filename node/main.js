'use strict';

var fs = require('fs'),
    path = require('path'),
    filePath = path.normalize('../data/langs.json'),
    languages;

fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
        console.log(err);
    }
    languages = JSON.parse(data);
    console.log(languages);
});

