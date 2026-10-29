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
    const scopeKey = env.localContext.scopeKey != null ? env.localContext.scopeKey : env.localContext.siteKey;
    const sourceConfig = robotsLib.resolveSourceConfig(env.localContext.project, env.localContext.branch, scopeKey);

    const appConfig = getAppConfig(sourceConfig);
    if (!appConfig) {
        return null;
    }

    return {
        _config: appConfig,
    };
};

function getAppConfig(sourceConfig) {
    const appConfig = utilLib.forceArray(sourceConfig)
        .filter(config => config && config.applicationKey === app.name)[0];
    return appConfig && appConfig.config;
}
