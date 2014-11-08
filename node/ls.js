'use strict';

var fs = require('fs'),
    os = require('os'),
    dataPath = '../data/snippets',
    folders = fs.readdirSync(dataPath),
    countedSnippets = {},
    files = {};

folders.forEach(function (folder) {
    var filesInDir = fs.readdirSync(dataPath + '/' + folder);
    countedSnippets[folder] = filesInDir.length;
    files[folder] = filesInDir;
});

fs.writeFile('../data/snippets.json', JSON.stringify(files, os.EOL, ' '), function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("snippets.json is updated");
    }
});

fs.writeFile('../data/countedSnippets.json', JSON.stringify(countedSnippets, os.EOL, ' '), function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("countedSnippers.json is updated");
    }
});