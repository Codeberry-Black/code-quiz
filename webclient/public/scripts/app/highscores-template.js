window.onload = function () {
    'use strict';
    app.apiCall('users', {}, function(ret){
        console.log(ret);
    });

    var users = [{
            id: '67563683055',
            name: 'Linus Torvalds',
            auth: 'xxx',
            rating: 2000,
            gameid: 0,
            mana: 0
        },
        {
            id: '67563683055',
            name: 'Arnold',
            auth: 'xxx',
            rating: 1000,
            gameid: 0,
            mana: 0
        },
        {
            id: '67563683055',
            name: 'Tiby',
            auth: 'xxx',
            rating: 900,
            gameid: 0,
            mana: 0
        },
        {
            id: '67563683055',
            name: 'Harry',
            auth: 'xxx',
            rating: 750,
            gameid: 0,
            mana: 0
        },
        {
            id: '67563683055',
            name: 'Antoni',
            auth: 'xxx',
            rating: 500,
            gameid: 0,
            mana: 0
        },
        {
            "id": "67563683055",
            "name": "Jessie",
            "auth": "xxx",
            "rating": 250,
            "gameid": 0,
            "mana": 0
        },
        {
            id: '67563683055',
            name: 'Jeremy',
            auth: 'xxx',
            rating: 100,
            gameid: 0,
            mana: 0
        }
    ];

    var templateHighscoresContainer = document.getElementById('templateHighscoresContainer');
    var templateHighscoresTemplate = Handlebars.compile((document.getElementById('halloffame-template')).innerHTML);

    // empty the container
    while (templateHighscoresContainer.firstChild) {
        templateHighscoresContainer.removeChild(templateHighscoresContainer.firstChild);
    }

    templateHighscoresContainer.innerHTML = templateHighscoresTemplate({
        users: users
    });
};