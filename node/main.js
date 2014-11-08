'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require("http");
    
var get_json = function(name, callback){
  var filePath = path.normalize('../data/'+name+'.json');
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {console.log(err);}
    data = JSON.parse(data);
    callback(data);
  });
};

var get_snippet = function(lang, id){
	var filePath = path.normalize('../data/snippets/'+lang+"/"+id);
	fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {console.log(err);}
    callback(data);
  });
};

var langs = {},
    games = {}
;

var shuffle = function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var get_game_set = function(count, ansCount){
	// Get random snippets
	var selectedSnippets = [];
	var elementsSelected = 0;
	var keys = Object.keys(langs);
	var slugs = {};
	
	while(elementsSelected != 3){
		var selectedLang = keys[Math.floor(Math.random() * keys.length)];
		if(langs[selectedLang].data != 0){
			var tempKeys = Object.keys(langs[selectedLang].data);
			var id = langs[selectedLang].data[tempKeys[Math.floor(Math.random() * tempKeys.length)]];
			var slug = selectedLang + id;
			if(slugs[slug])
				continue;
			slugs[slug] = true;
			
			
			// Get ansCount answers, one of them right
			var answers = [selectedLang];
			for(var i = 0; i < ansCount - 1; i++){
				var newAnswer;
				do{
					newAnswer = keys[Math.floor(Math.random() * keys.length)];
				}while(answers.lastIndexOf(newAnswer) != -1);
				answers.push(newAnswer);
			}
			
			shuffle(answers);
			selectedSnippets.push( {lang: selectedLang, id: id, answers: answers} );
			elementsSelected++;
		}	
	}
	
	
	
	return selectedSnippets;
};

var server = {
  list_games: function(){
    
  },
  
  
  
  
  
  
  options: {
    hostname: 'localhost',
    port: 123456
  },
  errors:{
    
    4000: "Not found.",
    5000: "Inernal server error."
  },
  map: {
    "games": "list_games"
    
  },
  instance: function(request, response){
    var me = {
      send_resp: function(data){
        me.response.writeHeader(200, {"Content-Type": "application/json"});  
        response.write("Hello World");  
        response.end();
      },
      send_error: function(code){
        if( !server.errors[code] ){ code=5000; }
        me.send_resp({result:code, message: server.errors[code]});
      },
      init: function(request, response){
        me.request = request;
        me.response = response;
        
        console.log(request);
        
        // some map ..
        
      }
    };
  }
};


var init = function(){
  get_json('langs', function(ret){
    for (var k in ret){
      langs[k] = {name: ret[k], data: []};
    }
    get_json('snippets', function(ret){
      for (var k in ret){
        langs[k].data = ret[k];
      }	  
	  
	  console.log(get_game_set(3, 4));
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

http.createServer(function(request,response){ 
  server.instance(request, response);
}).listen(server.options.port);  
