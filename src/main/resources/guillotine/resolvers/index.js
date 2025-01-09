const robotsLib = require('/lib/robots');
const utilLib = require('/lib/util');

exports.RobotsTxtType_text_Resolver = function (env) {
    return robotsLib.resolveText(env.source._config);
};

exports.RobotsTxtType_rules_Resolver = function (env) {
    return robotsLib.resolveRules(env.source._config);
};

exports.RobotsTxtType_sitemap_Resolver = function (env) {
    return robotsLib.resolveSitemap(env.source._config);
};

exports.RobotsTxtType_cachecontrol_Resolver = function (env) {
    return robotsLib.resolveCacheControl(env.source._config);
};

exports.HeadlessCmsType_robotstxt_Resolver = function (env) {
    const sourceConfig = robotsLib.resolveSourceConfig(env.localContext.project, env.localContext.branch, env.localContext.siteKey);

    if (isRobotsTxtAppNotInstalled(sourceConfig)) {
        return null;
    }

    return {
        _config: getAppConfig(sourceConfig),
    };
};

function getAppConfig(config) {
    return findAppConfigs(config)[0].config;
}

function isRobotsTxtAppNotInstalled(config) {
    return findAppConfigs(config).length === 0;
}

function findAppConfigs(config) {
    return utilLib.forceArray(config).filter(cfg => cfg && cfg.applicationKey === 'com.enonic.app.robotstxt');
}
