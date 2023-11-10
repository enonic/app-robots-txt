const contextLib = require('/lib/xp/context');
const robotsLib = require('/lib/robots');

function getSearchContext(req) {
    const currentContext = contextLib.get();

    return {
        project: req.params.project || currentContext.repository.replace('com.enonic.cms.', ''),
        branch: req.params.branch || currentContext.branch,
        siteKey: req.params.siteKey,
    };
}

exports.get = function (req) {
    const searchContext = getSearchContext(req);
    const body = robotsLib.getRobotsTxt(searchContext);
    return {
        contentType: 'text/plain',
        body: body,
    }
};
