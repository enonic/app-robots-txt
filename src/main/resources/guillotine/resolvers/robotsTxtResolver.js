const contextLib = require('/lib/xp/context');
const robotsLib = require('/lib/robots');

function getSearchContext(env) {
    const currentContext = contextLib.get();

    return {
        project: env.localContext.project || currentContext.repository.replace('com.enonic.cms.', ''),
        branch: env.localContext.branch || currentContext.branch,
        siteKey: env.localContext.siteKey,
    };
}

exports.resolver = function (env) {
    const searchContext = getSearchContext(env);
    return robotsLib.getRobotsTxt(searchContext);
};
