const portalLib = require('/lib/xp/portal');
const robotsLib = require('/lib/robots');

function handleGet(req) {
    const siteConfig = portalLib.getSiteConfig();

    const isJson = req.getHeader('accept') && req.getHeader('accept').indexOf('application/json') > -1;
    if (isJson) {
        return {
            body: JSON.stringify(robotsLib.resolveRules(siteConfig)),
            contentType: 'application/json'
        }
    } else {
        return {
            contentType: 'text/plain',
            body: robotsLib.resolveText(siteConfig)
        }
    }
}

exports.get = handleGet;
