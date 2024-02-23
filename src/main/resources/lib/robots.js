const contentLib = require('/lib/xp/content');
const projectLib = require('/lib/xp/project');
const ctxLib = require('./ctx');
const utilLib = require('/lib/util');

const DEFAULT_RULE = {
    userAgent: ['*'],
};

exports.resolveRules = function (config) {
    return createRules(config).rules;
}

exports.resolveSitemap = function (config) {
    return config.sitemap;
}

exports.resolveText = function (config) {
    const rules = createRules(config);
    return writePlainRobotsTxt(rules);
}

exports.resolveSourceConfig = function (project, branch, siteKey) {
    return ctxLib.executeInContext(project, branch, function () {
        if (siteKey === undefined) {
            const projectEntity = projectLib.get({
                id: project,
            });

            if (projectEntity) {
                return projectEntity.siteConfig;
            }
        } else {
            const site = contentLib.getSite({
                key: siteKey,
            });

            if (site) {
                return site.data.siteConfig;
            }
        }

        return {};
    });
};

function createRule(group) {
    return {
        userAgent: utilLib.forceArray(group.userAgent) || DEFAULT_RULE.userAgent,
        allow: utilLib.forceArray(group.allow),
        disallow: utilLib.forceArray(group.disallow)
    };
}

function writeRule(rule) {
    let result = '';

    utilLib.forceArray(rule.userAgent).forEach(function (userAgent) {
        result += `User-agent: ${userAgent}\n`;
    });

    utilLib.forceArray(rule.allow).forEach(function (allow) {
        result += `Allow: ${allow}\n`;
    });

    utilLib.forceArray(rule.disallow).forEach(function (disallow) {
        result += `Disallow: ${disallow}\n`;
    });

    return result;
}

function writePlainRobotsTxt(data) {
    let result = '';
    data.rules.forEach(function (rule) {
        result += writeRule(rule) + "\n";
    });
    if (data.sitemap) {
        result += `Sitemap: ${data.sitemap}\n`;
    }
    return result;
}

function createRules(config) {
    const result = {
        rules: [],
    };

    utilLib.forceArray(config.groups).forEach(group => {
        if (group) {
            result.rules.push(createRule(group));
        }
    });
    if (config.sitemap) {
        result.sitemap = config.sitemap;
    }

    if (result.rules.length === 0) {
        result.rules.push(DEFAULT_RULE);
    }

    return result;
}
