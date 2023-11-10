exports.RootQueryType_CreationCallback = function (graphQL) {
    return function (params) {
        params.addFields({
            robotstxt: {
                type: graphQL.reference('RobotsTxt'),
                args: {
                    project: graphQL.GraphQLString,
                    branch: graphQL.GraphQLString,
                    siteKey: graphQL.GraphQLString,
                }
            },
        });
    }
};
