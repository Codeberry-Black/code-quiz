var playViewModel = (function () {
    console.log(id);
    var id = window.location.hash.substring(1) || 0;
    var result = {};
    var f = function(){
        console.log(id);
        app.apiCall('joingame',{id:id},function(ret){
            if(ret.started == 0)
            {
                var snippetContainer = $('#game-list');
                var snippetTemplate = kendo.template($('#snippet-template').html());
                snippetContainer.append(snippetTemplate({
                    snippet: ret.question
                }));
            }
            setTimeout(function(){f()},250)
        });
    };
    f();
}());