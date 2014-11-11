var playViewModel = (function () {
    var id = window.location.hash.substring(1) || 0;
    window.gameid = id;
    var result = {};
    
    $(function(){
      $('#code-here a').on('click', function(){
      var answer = $(this).attr('rel');
      console.log(answer);
      app.apiCall( 'answer', {id: id, answer: answer} , function(ret){
        var button = $('#possible-answers a[rel='+answer+']');
        if( ret.correct ){
          button.addClass('success');
        }else{
          button.addClass('warning');
        }
        $('#user-mana').html( ret.mana );
      });
    });
      
      
    });
    
    
    $('#button-start').hide();
    app.apiCall('joingame',{id:id},function(ret){
      if(ret.ishost && !ret.started ){
        $('#button-start').show();
        $('#button-start').on('click', function(){
          app.apiCall('startgame', {id: id}, function(){
            app.apiCall('joingame',{id:id},function(ret){
              show_question(ret.question);
            });
          });
        });
      }
    });
    
    var f = function(){
      app.apiCall('joingame',{id:id},function(ret){
      
            
            if(!ret.started){
                var usersContainer = $('#users-list');
                $('#users-list').html('');
                  for(var i in ret.players){
                    var player = ret.players[i];
                    var usersTemplate = kendo.template($('#users-template').html());
                    console.log(player);
                    usersContainer.append(usersTemplate({
                        id: player.id,
                        rating: player.rating,
                        name: player.name
                    }));
                };
                setTimeout(function(){f();},1000);
            }else{
              app.apiCall('joingame',{id:id},function(ret){  
                show_question(ret.questsion);
              });
              
              var snippetContainer = $('#snippet-container');
              var snippetTemplate = kendo.template($('#snippet-template').html());
              snippetContainer.append(snippetTemplate({
                  snippet: ret.question
              }));
            }
        });
    }; f();
    
    
  
    
    
    
    
    
    
    
    
    
    
    
  var show_question = function(question){
    if( !question ){return;}

    $('#users-list').hide();
    $('#game').show();

    var t = 0;
    var total = 10000;
    var g = function(){
      $('#remaining-time').css('width', ((t / total) * 60) + '%');
      t += 250;
      setTimeout(function(){g();}, 250); 
    }; g();

    var pre = $('<pre style="height: 300px;">').attr('class', 'prettyprint linenums')
    pre.text(question.question).html();
    $('#question').html(pre);
    prettyPrint();

    for ( var i = 0; i < 4 ;i++ ){
      $('#answer' + (i+1))
              .html(question.answers[i])
              .attr('rel', question.answers[i])
              .removeClass('success')
              .removeClass('warning');
    }

    app.apiCall('turn', {id: window.gameid}, function(ret){
      if( !ret.isfinal ){
        show_question( ret.question );
      }else{
        alert('Game is over!');
      }
    });
  };
}());
