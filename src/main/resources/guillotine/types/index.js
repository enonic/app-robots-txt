exports.createRobotsTextType = function (graphQL) {
    return {
        description: 'RobotsTxt type',
        fields: {
            text: {
                type: graphQL.GraphQLString,
            },
            rules: {
                type: graphQL.list(graphQL.reference('RobotsRule')),
            },
            sitemap: {
                type: graphQL.list(graphQL.GraphQLString),
            },
        }
    };
};

exports.createRobotsRuleType = function (graphQL) {
    return {
        description: 'RobotsTxt rule type',
        fields: {
            userAgent: {
                type: graphQL.list(graphQL.GraphQLString),
            },
            allow: {
                type: graphQL.list(graphQL.GraphQLString),
            },
            disallow: {
                type: graphQL.list(graphQL.GraphQLString),
            }
        }
    };
};
