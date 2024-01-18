const robotsLib = require('/lib/robots');
const utilLib = require('/lib/util');

exports.get = function (req) {
    const sourceConfig = robotsLib.resolveSourceConfig(req.params.project, req.params.branch, req.params.siteKey);
    return {
        contentType: 'text/plain',
        body: robotsLib.resolve(getAppConfig(sourceConfig) || {}), // TODO check if app is installed, now it will return default config
    }
};

function getAppConfig(config) {
    return utilLib.forceArray(config).filter(cfg => cfg && cfg.applicationKey === 'com.enonic.app.robotstxt')[0].config;
}
