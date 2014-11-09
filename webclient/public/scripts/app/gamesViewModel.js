var gamesViewModel = (function () {
    var gameSelected = function (e) {
        app.mobileApp.navigate('views/gameView.html?uid=' + e.data.uid);
    };
    var navigateHome = function () {
        app.mobileApp.navigate('#welcome');
    };
    var logout = function () {
        app.AppHelper.logout()
            .then(navigateHome, function (err) {
                app.showError(err.message);
                navigateHome();
            });
    };

    return {
        gameSelected: gameSelected,
        logout: logout
    };
}());