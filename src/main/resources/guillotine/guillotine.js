const types = require('./types');
const resolvers = require('./resolvers');
const creationCallbacks = require('./callbacks');

exports.extensions = function (graphQL) {
    return {
        types: {
            RobotsTxt: types.createRobotsTextType(graphQL),
        },
        creationCallbacks: {
            HeadlessCms: creationCallbacks.HeadlessCmsType_CreationCallback(graphQL),
        },
        resolvers: {
            HeadlessCms: {
                robotstxt: resolvers.HeadlessCmsType_robotstxt_Resolver,
            },
            RobotsTxt: {
                text: resolvers.RobotsTxtType_text_Resolver,
            }
        },
    }
};
