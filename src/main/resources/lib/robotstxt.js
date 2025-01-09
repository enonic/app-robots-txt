const portalLib = require('/lib/xp/portal');
const robotsLib = require('/lib/robots');

function handleGet(req) {
    const siteConfig = portalLib.getSiteConfig();

    const isJson = req.getHeader('accept') && req.getHeader('accept').indexOf('application/json') > -1;
    let response;
    if (isJson) {
        response = {
            body: JSON.stringify(robotsLib.resolveRules(siteConfig)),
            contentType: 'application/json'
        }
    } else {
        response = {
            contentType: 'text/plain',
            body: robotsLib.resolveText(siteConfig)
        }
    }

    if (siteConfig.cacheControl) {
        const cacheControl = siteConfig.cacheControl.trim();
        if (cacheControl !== '') {
            response.headers = { 'Cache-Control': cacheControl }
        }
    }

    return response;
}

exports.get = handleGet;
