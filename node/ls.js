var fs = require('fs');
var os = require('os');

var path = '../data/snippets';

var folders = fs.readdirSync(path);
var files = {};

folders.forEach(function (folder) {
    files[folder] = fs.readdirSync(path+'/'+folder);
});

console.log(files);
