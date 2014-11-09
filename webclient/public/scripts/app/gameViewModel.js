var gameViewModel = kendo.observable({
    data: gameDataSource,
    gameID: 0,
    name: '',
    players: [],
    maxplayers: 7,
    addGame: function () {
        var self = this;
        this.set('added', true);

        this.data.fetch(function () {
            self.data.data().push(self.generateGameObject());
        });

        var gameTemplate = kendo.template($('#game-list-template').html());
        $('#game-list').append(gameTemplate(self.generateGameObject()));

        setTimeout(function () {
            self.set('added', false);
        }, 2000);
    },
    generateGameObject: function () {
        return {
            gameID: this.get("gameID"),
            name: this.get("name"),
            players: this.get("players"),
            maxplayers: this.get("maxplayers")
        }
    }
});