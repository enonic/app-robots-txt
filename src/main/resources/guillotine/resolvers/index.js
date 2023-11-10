exports.RobotsTxtType_text_Resolver = require('./robotsTxtResolver').resolver;

exports.RootQueryType_robotstxt_Resolver = function (graphQL) {
    return function (env) {
        return graphQL.createDataFetcherResult({
            data: __.toScriptValue({}),
            localContext: {
                __project: env.args.project,
                __branch: env.args.branch,
                __siteKey: env.args.siteKey,
            },
        });
    };
};

