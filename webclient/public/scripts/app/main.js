var app = (function () {
    'use strict';

    if( !$.cookie('auth') || $.cookie('auth') == 'undefined'){
window.fbAsyncInit = function () {
    FB.init({
        appId: '733423956732622',
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });
    
    
      FB.login(function (response) {
          if (response.authResponse) {
              getProfileInfo();
          } else {
              console.log('User cancelled login or did not fully authorize.');
          }
      }, { scope: 'user_photos' });

};
    }
// Load the SDK asynchronously
(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));


function getProfileInfo() {
    FB.api('/me', function (response) {
        var holder = $("#profile-info");
        var name = response.name;
        var url = "https://graph.facebook.com/" + response.id + "/picture";
        holder.append("<img src =" + url + "/><h1 id='greetings'>" + name + "</h1>");
        var userID = FB.getUserID();
        $.cookie('name',name);
        $.cookie('userID',userID);
        var auth = FB.getAccessToken();
        
        
        console.log(auth);
        $.cookie('auth',auth, {expires: 7, path: '/'});
        $.cookie('auth',auth, {expires: 7, path: '/', domain: 'localhost'});
        app.apiCall("login",{name:name,id:userID},function(){});
        /*app.router.route("game", function() {
            console.log("navigated to bar");
        });*/
        
    });
    $("#log").css("display", "none");
  }
  

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
        /*if (typeof FB !== 'undefined')
        {
            var auth = FB.getAccessToken();
            if(auth) {
                params.auth = auth;
                $.cookie('auth',auth);
            }
        }*/
        /*else
        {*/
            var auth = $.cookie('auth');
            if(auth) {
                params.auth = auth;
            }
        /*}*/

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