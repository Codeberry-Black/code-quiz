var gamesViewModel = (function () {
    app.apiCall("games",{},function(data){
        var games = data.games;
        var gameList = $('#game-list');
        for(var k in games)
        {
            console.log(k , games[k]);
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

            alert($(this).attr('rel'))
        })

    });
}());