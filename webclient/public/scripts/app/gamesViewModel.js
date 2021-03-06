var gamesViewModel = (function () {
    /*var router = new kendo.Router();
    router.route("../play.html/:id", function(id) {
        alert("navigated to game ", id, " was requested");
    });
    router.start();*/
    app.apiCall("games",{},function(data){
        var games = data.games;
        var gameList = $('#game-list');
        for(var k in games)
        {
            var game= games[k];
            var gameTemplate = kendo.template($('#game-list-template').html());
            gameList.append(gameTemplate({
                rel: game.id,
                name: game.name,
                creator:game.creator,
                playersCount:game.players.length,
                maxplayers:game.maxplayers
            }));
        };
        
        
        
        
        $('#game-list input').on('click', function(){
             /*router.navigate($(this).attr('rel'));
            *//*alert($(this).attr('rel'))*//*
            router.start();*/
          
            var id =$(this).attr('rel') ;
            setTimeout(function(){
              window.location = 'play.html#' + id;
            }, 0 );

        });

        $('#button-create').on('click', function(){
            app.apiCall("creategame",{
                players:4,
                name:'HackFMI '+ games.length,
                turns:10},function(ret){
                setTimeout(function(){
                  window.location = 'play.html#' + ret.game;
                }, 0 );    
            });
        });
    });

}());