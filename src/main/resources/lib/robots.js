const contentLib = require('/lib/xp/content');
const projectLib = require('/lib/xp/project');
const ctxLib = require('./ctx');

const DEFAULT_RULE = {
    userAgent: ['*'],
    disallow: [''],
};

function _forceArray(data) {
	return (Array.isArray(data) ? data : [data]);
}

exports.resolve = function (config) {
    if (Object.keys(config).length) {
        if (config.groups) {
            const rules = createRules(config);
            return writePlainRobotsTxt(rules);
        } else if (config.robotstxt) {
            return config.robotstxt;
        }
    }

    return createDefaultRobotsTxt();
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
        userAgent: group.userAgent && _forceArray(group.userAgent) || [],
        allow: group.allow && _forceArray(group.allow) || [],
        disallow: group.disallow && _forceArray(group.disallow) || []
    };
}

function writeRule(rule) {
    let result = '';

    (rule.userAgent || ['*']).forEach(function (userAgent) {
        result += `User-agent: ${userAgent}\n`;
    });

    (rule.allow || []).forEach(function (allow) {
        result += `Allow: ${allow}\n`;
    });

    (rule.disallow || ['']).forEach(function (disallow) {
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

    if (config.groups) {
        _forceArray(config.groups).forEach(group => {
            if (group) {
                result.rules.push(createRule(group));
            }
        });
        if (config.sitemap) {
            result.sitemap = config.sitemap;
        }
    }

    if (result.rules.length === 0) {
        result.rules.push(DEFAULT_RULE);
    }

    return result;
}

function createDefaultRobotsTxt() {
    return writePlainRobotsTxt(createRules({groups: []}));
}
