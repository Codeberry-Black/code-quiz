var app = (function () {
    'use strict';

    var port = 12346;

    var applicationSettings = {
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        apiKey: '733423956732622'
    };

    var router = new kendo.Router();

    router.route("/games(/:category)(/:id)", function(category, id) {
        console.log(category, "item with", id, " was requested");
    });
        
    var joinGame = function() {
        //var userId = activity.get('UserId');
        console.log("Here!");
        /*var user = $.grep(usersModel.users(), function (e) {
            return e.Id === userId;
        })[0];
        this.JoinedUsers = this.JoinedUsers || [];
        this.JoinedUsers.push(user);
        console.log(this.JoinedUsers);
        var activities = app.viewModels.activities.activities;
        activities.one('sync', function () {
            app.mobileApp.navigate('#:back');
        });
        activities.sync();*/
    };

    // login view model
    var loginViewModel = (function () {
        var loginWithFacebook = function() {
            facebook.getAccessToken(function(token) {
                el.Users.loginWithFacebook(token)
                .then(function () {
                    return usersModel.load();
                })
                .then(function () {
                    mobileApp.hideLoading();
                    mobileApp.navigate('views/activitiesView.html');
                        kendo.navi
                })
                .then(null, function (err) {
                    mobileApp.hideLoading();
                    if (err.code = 214) {
                        showError("The specified identity provider is not enabled in the backend portal.");
                    }
                    else {
                        showError(err.message);
                    }
                });
            })
        } 
        return {
            loginWithFacebook: loginWithFacebook
        };
    }());

    var apiCall = function (method, params, cb) {
        $.getJSON('localhost:' + port, params, function(result){
            if(result.result !== 0){
                console.assert(result, 'Stupid error message');
            } else {
                cb(result);
            }
        });
    };

    return {
        viewModels: {
            login: loginViewModel
        },
        mobileApp: mobileApp,
        joinToGame: joinToGame,
        apiCall: apiCall
    };
}());