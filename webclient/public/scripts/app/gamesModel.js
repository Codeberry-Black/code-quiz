var gamesModel = (function () {
    var gameModel = {
        gameid: 'Id',
        fields: {
            Text: {
                field: 'Text',
                defaultValue: ''
            },
            UserId: {
                field: 'UserId',
                defaultValue: ''
            },
            JoinedUsers: {
                field: 'JoinedUsers',
                defaultValue: []
            }
        }
    };
    var gamesDataSource = new kendo.data.DataSource({
        schema: {
            model: gameModel
        },
        change: function (e) {
            if (e.items && e.items.length > 0) {
                $('#no-activities-span').hide();
            }
            else {
                $('#no-activities-span').show();
            }
        },
        sort: { field: 'ScheduleDate', dir: 'desc' },
        filterable: {
            field: "Text",
            operator: "startswith"
        },
        serverFiltering: true
    });

    return {
        activities: activitiesDataSource
    };
}());