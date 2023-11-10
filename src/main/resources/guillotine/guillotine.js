const types = require('./types');
const resolvers = require('./resolvers');
const creationCallbacks = require('./callbacks');

exports.extensions = function (graphQL) {
    return {
        types: {
            RobotsTxt: types.createRobotsTextType(graphQL),
        },
        creationCallbacks: {
            Query: creationCallbacks.RootQueryType_CreationCallback(graphQL),
        },
        resolvers: {
            Query: {
                robotstxt: resolvers.RootQueryType_robotstxt_Resolver(graphQL),
            },
            RobotsTxt: {
                text: resolvers.RobotsTxtType_text_Resolver,
            }
        },
    }
};
