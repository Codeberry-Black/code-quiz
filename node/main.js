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
  return (hrTime[0] * 1000000 + hrTime[1] / 1000) / 1000;
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

var get_game_question = function(gameid, turn){
  if(!games[gameid]){return false;}
  var game = games[gameid];
  if(!game.started){return false;}
  if(turn >= game.turns){ return false; }
  
  // TODO: some decoration ...
  
  return {
    question: game.questions[turn],
    answers: game.answers[turn][1]
  };
};

var get_game_answer = function(gameid, turn){
  if(!games[gameid]){return false;}
  var game = games[gameid];
  if(!game){return false;}
  if(turn >= game.turns){ return false; }
  return game.answers[turn][0];  
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

var check_user_not_in_game=function(gameid, userid){
  if(users[userid].gameid && users[userid].gameid != gameid){
    if(!games[users[userid].gameid]){
      delete users[userid].gameid;
    }else{
      var game = games[users[userid].gameid];
      if( !game.players[userid] ){
        delete users[userid].gameid;
      }else if(game.started && !game.finished){
        return false;
      }
    }
  }
  return true;
};

var dt = 100;

var knockdt = 5000;
var answertime = 10000;
var magictime = 5000;

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
      id=Math.floor(Math.random()*100000000);
      if(!games[id]){break;}
    }
    
    if(!check_user_not_in_game(id, params.userid)){
      send(2001); return;
    }
    
    if(!params.players){send(1002); return;}
    if(!params.name){send(1004); return;}
    if(!params.turns){params.turns = 20;}
    
    params.turns = parseInt(params.turns, 10);
    
    
    games[id] = {
      id: id,
      creator: params.userid,
      players: {},
      maxplayers: params.players,
      started: false,
      finished: false,
      created: ts(),
      // magictime: false, // TODO: We could add magic diff stuff ...
      name: params.name,
      turns: params.turns,
      questions: [],
      answers: []
    };
    
    games[id].players[params.userid]={
      turn: 0,
      mana: 0,
      knock: games[id].created,
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
    if(!params.id){send(1001); return;}
    if(!games[params.id]){send(2002); return;}
    if(!check_user_not_in_game(params.id, params.userid)){
      send(2001);
      return;
    }
    
    var game = games[params.id];
    if(game.finished){send(2007); return;}
    if(!game.turns){send(2007); return;}
    
    if(game.started && !game.players[params.userid]){send(2004); return;}
   
    
    var T = ts(),
        result=0,
        hostleft = false,
        players = 0;
    for(var playerid in game.players){
      if(game.players[playerid].knock < T - knockdt){
        if(playerid === game.creator){
          hostleft = true;
        }
        if(playerid === params.userid){
          delete games[params.id].players[playerid];
          delete users[playerid].gameid;
          result = 2006;
        }
      }else{
        players++;
      }
    }
    
    if(players >= game.maxplayers){
      result = 2003;
    }
    
    if(hostleft){
      for(var playerid in game.players){
        delete users[playerid].gameid;
      }
      delete games[params.id];
      result = 2005;
    }
    
    if(result > 0){ send(result); return; }
    
    if(!game.players[params.userid]){
      games[params.id].players[params.userid] = {
        turn: 0,
        mana: 0,
        knock: 0,
        answers: []
      };
      users[params.userid].gameid=params.id;
    }
    game.players[params.userid].knock = T;
    
    var players = get_userdatas(Object.keys(game.players));
    var question = get_game_question(game.id, 0);
    
    send({
      result: 0, 
      ishost: params.userid === game.creator,
      started: game.started,
      players: players, 
      question: question,
      name: game.name,
      id: game.id,
      maxplayers: game.maxplayers
    });
  },
  start_game: function(params, send){
    if(!params.id){send(1001); return;}
    if(!games[params.id]){send(2002); return;}
    if(games[params.id].creator !== params.userid ){send(2008); return;}
    var T = ts();
    
    games[params.id].started = true;
    games[params.id].players[params.userid].knock = T;
    
    for (var playerid in games[params.id].players){
      if( games[params.id].players[playerid].knock < T - knockdt){
        delete games[params.id].players[playerid];
        delete users[playerid].gameid;
      }
    }
    
    send({result: 0});
  },
  game_diff: function(params, send){
    if(!params.id){send(1001); return;}
    if(!games[params.id]){send(2002); return;}
    var game = games[params.id];
    if(!game.started){send(2009); return;}
    if(!game.players[params.userid]){send(2010); return;}
    if(game.finished){send(2007); return;}
    
    // TODO: Is the host left?
    
    game.players[params.userid].knock= ts();
    setTimeout(function(){
      games[params.id].players[params.userid].turn++;
      if( games[params.id].players[params.userid].turn > 
          games[params.id].players[params.userid].answers.length){
    
        games[params.id].players[params.userid].answers.push('');
    
      }
      
      var isover = false, cnt = 0;
      for(var playerid in games[params.id].players){
        if(games[params.id].turns <= games[params.id].players[playerid].turn){
          if(params.userid === playerid){isover=true;}
          cnt++;
        }
      }
      if(cnt === Object.keys(games[params.id].players).length){
        games[params.id].finished=true;
      }
      
      if(isover){
        var resp = {
          result: 0, 
          isfinal:true,
          mana: game.players[params.userid].mana
        };
      }else{
        var resp = {
          result: 0,
          isfinal: false,
          mana: game.players[params.userid].mana,
          question: get_game_question(params.id, games[params.id].players[playerid].turn)
        };
      }
      send(resp);
    }, answertime);
  },
  receive_answer: function(params, send){
    var given = {};
    if(!params.id){send(1001); return;}
    if(!params.answer){send(1005); return;}
    if(!games[params.id]){send(2002); return;}
    var game = games[params.id];
    if(!game.started){send(2009); return;}
    if(game.finished){send(2007); return;}
    if(!game.players[params.userid]){send(2010); return;}
    
    var correct_answer = get_game_answer(params.id, game.players[params.userid].turn),
        correct = false;
    if(correct_answer === params.answer){
      correct = true;
      var delta = ts() - game.players[params.userid].knock;
      games[params.id].players[params.userid].mane += (delta * delta)/1000;
    }
    
    send({
      result:0, 
      mana: games[params.id].players[params.userid].mana, 
      correct: correct
    });
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
    1005: "'answer' is required",
    
    
    2000: "Authentication failed. Access denied.",
    2001: "You are already in a game.",
    2002: "Game not found.",
    2003: "The game is already full.",
    2004: "Game already started.",
    2005: "The host left the game.",
    2006: "You have too slow connection for this game.",
    2007: "Game is over.",
    2008: "You are not the host of the game.",
    2009: "Game is not started.",
    2010: "You are not playing this game.",
    
    
    
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
    "/startgame": ["start_game", true],
    "/turn": ["game_diff", true],
    "/answer": ["receive_answer", true],
    
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
