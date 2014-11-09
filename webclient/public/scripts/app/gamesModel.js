var gamesModel = (function () {
    var gameModel = {
        gameid: 0,
        fields: {
            name: {
                field: 'Text',
                defaultValue: ''
            },
            hostId: {
                field: 0
            },
            joinedUsers: {
                field: ['JoinedUsers'],
                defaultValue: []
            }
        }
    };
    var gamesDataSource = new kendo.data.DataSource({
        schema: {
            model: gameModel
        },
        change: function (e) {
            if (e.items && e.items.length > 0) {
                $('#no-games-span').hide();
            }
            else {
                $('#no-games-span').show();
            }
        }
    });

    return {
        games: gamesDataSource
    };
}());