var playViewModel = (function () {
    console.log(id);
    var id = window.location.hash.substring(1) || 0;

    var f = function(){
        console.log(id);
        app.apiCall('joingame',{id:id},function(ret){
            console.log(ret);
            setTimeout(function(){f()},250)
        });
    };
    f();
}());