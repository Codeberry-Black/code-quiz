var app = (function () {
    'use strict';

    var port = 12346;

    var applicationSettings = {
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        apiKey: '733423956732622'
    };

    var router = new kendo.Router();

    router.route("games");

    router.start();
        
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

    var apiCall = function (method, params, cb) {
        /*var auth = FB.getAccessToken();
        if(auth) params.auth = auth;*/
        $.getJSON('http://localhost:' + port+'/'+method, params, function(result){
            if(result.result !== 0){
                console.assert(result, 'Stupid error message');
                alert(result.message);
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
        apiCall: apiCall,
        router: router
    };
}());