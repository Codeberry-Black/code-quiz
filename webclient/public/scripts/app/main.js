var app = (function () {
    'use strict';

    window.fbAsyncInit = function () {
        FB.init({
            appId: '733423956732622',
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });
    };
    (function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));

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
        if (typeof FB !== 'undefined')
        {
            var auth = FB.getAccessToken();
            if(auth) params.auth = auth;
            $.cookie('auth','auth');
        }

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