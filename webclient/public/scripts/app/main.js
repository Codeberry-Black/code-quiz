var app = (function () {
    'use strict';

    var port = 12346;

    // global error handling
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
        console.log(title);
        console.log(message);
        console.log(callback);
    };
    var showError = function(message) {
        showAlert(message, 'Error occured');
    };
    window.addEventListener('error', function (e) {
        e.preventDefault();
        var message = e.message + "' from " + e.filename + ":" + e.lineno;
        showAlert(message, 'Error occured');
        return true;
    });

    document.addEventListener("deviceready", onDeviceReady, false);

    var applicationSettings = {
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        apiKey: '733423956732622'
    };

    var facebook = new IdentityProvider({
        name: "Facebook",
        loginMethodName: "loginWithFacebook",
        endpoint: "https://www.facebook.com/dialog/oauth",
        response_type:"token",
        client_id: "622842524411586",
        redirect_uri:"https://www.facebook.com/connect/login_success.html",
        access_type:"online",
        scope:"email",
        display: "touch"
    });
    
    var AppHelper = {
        logout: function () {
            //return el.Users.logout();
            //TODO Logout from server
            return ;
        }
    };

    var mobileApp = new kendo.mobile.Application(document.body, { transition: 'slide', layout: 'mobile-tabstrip' });
        
    var joinToRoute = function() {
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
//    var gamesModel = (function () {
//        var currentUser = kendo.observable({ data: null });
//        var usersData;
//        var loadGames = function () {
//            return  //TODO load from server el.Users.currentUser()
//            .then(function (data) {
//                var currentUserData = data.result;
//                //currentUserData.PictureUrl = AppHelper.resolveProfilePictureUrl(currentUserData.Picture);
//                currentUser.set('data', currentUserData);
//                return ;//TODO get games list el.Users.get();
//            })
//            .then(function (data) {
//                gamesData = new kendo.data.ObservableArray(data.result);
//            })
//            .then(null,
//                  function (err) {
//                      showError(err.message);
//                  }
//            );
//        };
//        return {
//            load: loadGames,
//            games: function () {
//                return gamesData;
//            },
//            currentUser: currentUser
//        };
//    }());

    // login view model
    var loginViewModel = (function () {
        var loginWithFacebook = function() {
            mobileApp.showLoading();
            facebook.getAccessToken(function(token) {
                el.Users.loginWithFacebook(token)
                .then(function () {
                    return usersModel.load();
                })
                .then(function () {
                    mobileApp.hideLoading();
                    mobileApp.navigate('views/activitiesView.html');
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
        };
        return {
            login: login,
            loginWithFacebook: loginWithFacebook
        };
    }());

    // signup view model
    var singupViewModel = (function () {
        var dataSource;
        var signup = function () {
            dataSource.Gender = parseInt(dataSource.Gender);
            var birthDate = new Date(dataSource.BirthDate);
            if (birthDate.toJSON() === null)
                birthDate = new Date();
            dataSource.BirthDate = birthDate;
            Everlive.$.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
            .then(function () {
                showAlert("Registration successful");
                mobileApp.navigate('#welcome');
            },
                  function (err) {
                      showError(err.message);
                  }
            );
        };
        var show = function () {
            dataSource = kendo.observable({
                Username: '',
                Password: '',
                DisplayName: '',
                Email: '',
                Gender: '1',
                About: '',
                Friends: [],
                BirthDate: new Date()
            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
        };
        return {
            show: show,
            signup: signup
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

    var languages = function (method, params, cb) {
        $.getJSON('localhost:' + port + '/languages', params, function(result){
            if(result.result !== 0){
                console.assert(result, 'Stupid error message');
            } else {
                cb(result);
                console.log(result);
            }
        });
    };

    return {
        viewModels: {
            login: loginViewModel,
            gamesModel: gamesModel,
            signup: singupViewModel,
            usersModel: usersModel,
            playingGame: playingGameViewModel,
            apiCall: apiCall,
            languages: languages
        },
        mobileApp: mobileApp,
        joinToGame: joinToGame
    };
}());