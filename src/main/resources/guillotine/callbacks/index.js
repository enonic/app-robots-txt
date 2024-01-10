exports.HeadlessCmsType_CreationCallback = function (graphQL) {
    return function (params) {
        params.addFields({
            robotstxt: {
                type: graphQL.reference('RobotsTxt'),
            },
        });
    }
};
