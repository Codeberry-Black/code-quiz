'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');


var start_rating = 1000;

var langs = {},
    games = {},
    users = {};

var ts = function(){
  var hrTime = process.hrtime();
  return hrTime[0] * 1000000 + hrTime[1] / 1000;
};

var get_snippet = function(lang, id){
      var filePath = path.normalize('../data/snippets/'+lang+"/"+id);
      return fs.readFileSync(filePath, 'utf8').toString();
};

var get_json = function(name, callback){
  var filePath = path.normalize('../data/'+name+'.json');
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {console.log(err);}
    data = JSON.parse(data);
    callback(data);
  });
};

var save_json = function(name, data, callback){
  var filePath = path.normalize('../data/'+name+'.json');
  fs.writeFile(filePath, JSON.stringify(data),{encoding: "utf8"}, function (err, data) {
    if (err) {console.log(err);}
    callback(data);
  });
};

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
	
	while(elementsSelected !== count){
		var selectedLang = keys[Math.floor(Math.random() * keys.length)];
		if(langs[selectedLang].data.length !== 0){
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
				}while(answers.lastIndexOf(newAnswer) !== -1);
				answers.push(newAnswer);
			}
			
			shuffle(answers);
			selectedSnippets.push( {lang: selectedLang, id: id, answers: answers} );
			elementsSelected++;
		}	
	}
	
	return selectedSnippets;
};

var get_game_current_question = function(gameid){
  if(!games[gameid]){return false;}
  var game = games[gameid];
  if(!game){return false;}
  if(game.turn >= games[gameid].questions.length){ return false; }
  
  var data = {
    question: game.questions[game.turn],
    answers: game.answers[game.turn][1]
  };
};

var get_game_current_answer = function(gameid){
  if(!games[gameid]){return false;}
  var game = games[gameid];
  if(!game){return false;}
  if(game.turn >= games[gameid].questions.length){ return false; }
  
  return game.answers[game.turn][0];  
};

var get_userdatas = function(userids){
  var result = [];
  for (var k in userids){
    result.push({
      id: users[userids[k]].id, 
      name: users[userids[k]].name, 
      rating: users[userids[k]].rating
    });
  }

  result.sort(function(a, b){
    if(a.rating > b.rating) return -1;
    if(a.rating < b.rating) return 1;
    return 0;
  });

  return result;
};

var dt = 100;

var knockdt = 3000000;

var server = {
  list_languages: function(params, send){
    var result = [];
    var langcnt = 0, snippetscnt = 0;
    
    for(var k in langs){ 
      langcnt ++;
      snippetscnt += langs[k].data.length;
      
      result.push({name: langs[k].name}); 
    }
    send({result: 0, languages: result, counts: {languages: langcnt, snippets: snippetscnt}});
  },
  list_users: function(params, send){
    var result = get_userdatas(Object.keys(users));
    send({result: 0, users:result});
  },
  list_games: function(params, send){
    var result = [];
    for(var k in games){
      var g = games[k];
      if(g.started){continue;}
      
      var players = [];
      for (var i in g.players){
        var pid = g.players[i];
        players.push({
          id: users[pid].id,
          name: users[pid].name,
          rating: users[pid].rating
        });
      }
      
      result.push({
        creator: users[g.creator].name,
        creatorid: users[g.creator].id,
        players: players,
        maxplayers: g.maxplayers,
        name: g.name,
        id: g.id
      });
    }
    send({result: 0, games: result});
  },
  get_snippet: function(params, send){
    if( !params.lang ){send(1000); return;}
    if( !params.id ){send(1001); return;}

    send({
      result: 0,
      snippet: get_snippet( params.lang, params.id)
    });
  },
  
  wait: function(params, send){
    i--;
    console.log(i);
    var f = function(){
      if (i > 0){setTimeout(function(){f();}, dt);}
      else{ send({result:0}); }
    };
    f();
  },
  wake: function(params, send){
    i=0;
    send({result:0});
  },
  login: function(params, send){
    if( !params.id ){send(1001); return;}
    if( !params.name ){send(1004); return;}
    if( !params.auth ){send(1003); return;}
    
    // TODO: check that the auth is real :)
    
    if (!users[params.id]){
      users[params.id] = {
        id: params.id,
        name: params.name,
        auth: params.auth,
        rating: start_rating,
        gameid: 0,
        mana: 0
      };
      
      save_json('users', users, function(){
        send({result: 0});
      });
      return;
    }else{
      users[params.id].auth = params.auth;
    }
    
    send({result: 0});
  },
  create_game: function(params, send){
    var id;
    while(true){
      id = Math.random();
      if(id==0 || !games[id]){break;}
    }
    if(!params.players){send(1002); return;}
    if(!params.name){send(1004); return;}
    if(!params.turns){params.turns = 20;}
    
    if(users[ params.userid ].gameid > 0){
      // TODO: this should check if the game is not started or the game is started and turnuntil < now() else send error 
      //games[users[ params.userid ].gameid] = undefined;
    }
    
    games[id] = {
      id: id,
      creator: params.userid,
      players: [params.userid],
      maxplayers: params.players,
      turn: 0,
      turnuntil: 0,
      knocks: {},      
      name: params.name,
      started: false,
      magictime: false,
      questions: [],
      answers: []
    };
    
    users[ params.userid ].gameid = id;
    
    var set = get_game_set(params.turns, 4); 
    for (var i = 0; i < params.turns ;i++){
      games[id].answers.push([set[i].lang, set[i].answers]);
      games[id].questions.push(get_snippet(set[i].lang, set[i].id));
    }
    
    send({result:0, game: id});
  },
  join_game: function(params, send){
    // so ... this is the knock - knock thing ...
    
    if(!params.id){send(1001); return;}
    if(!games[params.id]){send(2002); return;}
    
    var T = ts();
    var game;
    if(users[params.userid].gameid && users[params.userid].gameid !== params.id){
      if(!games[users[params.userid].gameid] ){
        users[params.userid].gameid = 0;
      }else{
        game = games[users[params.userid].gameid];
        if(game.started){
          if(game.turnuntil > T){
            send(2001);
            return;
          }else{
            delete games[users[params.userid].gameid];
          }
        }
      }
    }
    
    if( games[[params.id]].started){
      send(2004);
      return;
    }
    
    game = games[params.id];
    
    if(!game.knocks){
      send(2007);
      return;
    }
    
    var cnt = 0, hostleft = false, knocked  = [], meknocked = false;
    for(var k in game.players){
      var playerid = game.players[k];
      if( game.knocks[playerid] ){
        if(playerid === params.userid){meknocked = true;}
        if(game.knocks[playerid] < T - knockdt){
          users[playerid].gameid = 0;
          if(playerid === game.creator){
            hostleft = true;
          }
          if(playerid === params.userid){
            send(2006);
            return;
          }
        }else{
          cnt ++;
          knocked.push(game.players[k]);
        } 
      }
    }
    if( !meknocked ){
      knocked.push(params.userid);
      cnt ++;
    }
    
    
    if(cnt > game.maxplayers){
      send(2003);
      return;
    }
    
    if(hostleft){
      delete games[params.id];
      send_error(2005);
      return;
    }
    
    games[params.id].players = knocked;
    games[params.id].knocks[ params.userid ] = T;
    
    var players = get_userdatas(knocked);
    var question = get_game_current_question(game.id);
    
    send({result: 0, started: game.started, players: players, question: question});
  },
  start_game: function(params, send){
    if(!params.id){send(1001); return;}
    if(!games[params.id]){send(2002); return;}
    if(!games[params.id]){send(2002); return;}
    
    
  },
  diff_game: function(params, send){
    
    
  },
  options: {
    hostname: 'localhost',
    port: 12346
  },
  errors:{
    1000: "'lang' is required",
    1001: "'id' is required",
    1002: "'players' is required",
    1003: "'auth' is required",
    1004: "'name' is required",
    
    
    2000: "Authentication failed. Access denied.",
    2001: "You are already in a game.",
    2002: "Game not found.",
    2003: "The game is already full.",
    2004: "Game already started.",
    2005: "The host left the game.",
    2006: "You have too slow connection for this game.",
    2007: "This is a demo game.",
    
    4000: "Method not found.",
    5000: "Inernal server error."
  },
  map: {
    "/games": ["list_games", false],
    "/snippet": ["get_snippet", false],
    "/login": ["login", false],
    "/creategame": ["create_game", true],
    "/languages": ["list_languages", false],
    "/users": ["list_users", false],
    "/joingame": ["join_game", true],
    
    
  },
  check_auth: function(auth){
    for (var k in users){
      //console.log(users[k].auth == auth);
      if(users[k].auth == auth){
        if( k != users[k].id) {return false;}
        return users[k].id;
      }
    }
    return false;
  },
  instance: function(request, response){
    var me = {
      send_resp: function(data){
        me.response.writeHeader(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        });
        response.write(JSON.stringify(data));  
        response.end();
      },
      send_error: function(code){
        if( !server.errors[code] ){ code=5000; }
        me.send_resp({result:code, message: server.errors[code]});
      },
      init: function(request, response){
        me.request = request;
        me.response = response;
        
        var parts = request.url.split("?",2);
        var method = parts[0];
        
        if (parts.length == 1){parts[1] = '';}
        
        if ( !server.map[method]){
          me.send_error(4000);
          return;
        }
        parts = parts[1].split('&');
        var params={};
        for(var k in parts){
          var sparts = parts[k].split('=');
          if(sparts[0] === ''){continue;}
          if(sparts.length == 1){ sparts[1] = ''; }
          sparts[1] = sparts[1].split("+").join(" ");
          params[sparts[0]] = decodeURIComponent(sparts[1]);
        }
        
        var mapped = server.map[method];
        if(mapped[1]){
          if(!params.auth){
            me.send_error(2000);
            return;
          }
          params.userid = server.check_auth(params.auth);
          if(!params.userid){
            me.send_error(2000);
            return;
          }
        }
        
        server[mapped[0]] (params, function(result){
          if(!result || typeof result == "number" ){
            me.send_error(result);
          }else{
            me.send_resp(result);
          }
        });
      }
    };
    me.init(request, response);
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
      get_json('users', function(ret){
        users = ret;
        get_json('games', function(ret){
          games = ret;
          
          http.createServer(function(request,response){ 
            console.log(request.url);
            server.instance(request, response);
          }).listen(server.options.port, server.options.host);      
        });
      });
    });
  });
};

init();
