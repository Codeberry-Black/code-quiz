'use strict';

var fs = require('fs'),
    os = require('os'),
    dataPath = '../data/snippets',
    folders = fs.readdirSync(path),
    files = {};

folders.forEach(function (folder) {
    files[folder] = fs.readdirSync(dataPath + '/' + folder);
});

fs.writeFile('snippets.json', JSON.stringify(files, os.EOL, ' '), function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});

console.log(files);
