exports.createRobotsTextType = function (graphQL) {
    return {
        description: 'RobotsTxt type',
        fields: {
            text: {
                type: graphQL.GraphQLString,
            }
        }
    };
};
