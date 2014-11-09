window.onload = function () {
    'use strict';

    app.apiCall('users', {}, function(ret){
        var users = ret.users;

        var templateHighscoresContainer = document.getElementById('templateHighscoresContainer');
        var templateHighscoresTemplate = Handlebars.compile((document.getElementById('halloffame-template')).innerHTML);

        // empty the container
        while (templateHighscoresContainer.firstChild) {
            templateHighscoresContainer.removeChild(templateHighscoresContainer.firstChild);
        }

        templateHighscoresContainer.innerHTML = templateHighscoresTemplate({
            users: users
        });
    });
};