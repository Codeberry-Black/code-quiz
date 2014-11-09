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
        $.cookie('name','name');
        $.cookie('userID','userID');
        var auth = FB.getAccessToken();
        $.cookie('auth','auth');
        app.apiCall("login",{name:name,id:userID},function(){});
        /*app.router.route("game", function() {
            console.log("navigated to bar");
        });*/

    });
    $("#log").css("display", "none");
}
