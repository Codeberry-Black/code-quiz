'use strict';

var fs = require('fs'),
    path = require('path');

var get_json = function(name, callback){
  var filePath = path.normalize('../data/'+name+'.json');
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {console.log(err);}
    data = JSON.parse(data);
    callback(data);
  });
};

var langs = {},
    games = {}

;
var init = function(){
  get_json('langs', function(ret){
    for (var k in ret){
      langs[k] = {name: ret[k], data: []};
    }
    get_json('snippets', function(ret){
      for (var k in ret){
        langs[k].data = ret[k];
      }
      get_json('games', function(ret){


        console.log(ret);
      });

      // GET USERS
      // GET GAMES
      // START SERVER


    });
  });
};

init();

var server = {};