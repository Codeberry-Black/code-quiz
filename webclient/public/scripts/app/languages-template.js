window.onload = function () {
    'use strict';

    app.apiCall('languages', {}, function(ret){
        var languages = ret.languages;
        console.log(languages);

        var templateLangContainer = document.getElementById('template-lang-container');
        var templateLangTemplate = Handlebars.compile((document.getElementById('template-lang-template')).innerHTML);

        // empty the container
        while (templateLangContainer.firstChild) {
            templateLangContainer.removeChild(templateLangContainer.firstChild);
        }

        templateLangContainer.innerHTML = templateLangTemplate({
            langs: languages
        });
    });
};