const contextLib = require('/lib/xp/context');
const utilLib = require('/lib/util');
const contentLib = require('/lib/xp/content');
const projectLib = require('/lib/xp/project');

const DEFAULT_RULE = {
    userAgent: ['*'],
    disallow: [''],
};

function createRule(group) {
    return {
        userAgent: group.userAgent && utilLib.data.forceArray(group.userAgent) || [],
        allow: group.allow && utilLib.data.forceArray(group.allow) || [],
        disallow: group.disallow && utilLib.data.forceArray(group.disallow) || []
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
        utilLib.data.forceArray(config.groups).forEach(group => {
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

function resolveRobotsTxtConfig(searchContext) {
    const project = searchContext.project;
    const branch = searchContext.branch;
    const siteKey = searchContext.siteKey;

    let siteConfigs = null;
    if (siteKey) {
        const site = contextLib.run({
            branch: branch,
            repository: `com.enonic.cms.${project}`,
        }, function () {
            return contentLib.getSite({
                key: siteKey,
            });
        });

        if (site) {
            siteConfigs = site.data.siteConfig && utilLib.data.forceArray(site.data.siteConfig) || [];
        }
    } else {
        const projectEntity = projectLib.get({
            id: project,
        });
        if (projectEntity && projectEntity.siteConfig) {
            siteConfigs = utilLib.data.forceArray(projectEntity.siteConfig);
        }
    }

    const siteConfig = (siteConfigs || []).filter(config => config.applicationKey === 'com.enonic.app.robotstxt')[0];
    return siteConfig && siteConfig.config || {};
}

function createDefaultRobotsTxt() {
    return writePlainRobotsTxt(createRules({groups: []}));
}

exports.getRobotsTxt = function (searchContext) {
    const config = resolveRobotsTxtConfig(searchContext);
    if (Object.keys(config).length) {
        if (config.groups) {
            const rules = createRules(config);
            return writePlainRobotsTxt(rules);
        } else if (config.robotstxt) {
            return config.robotstxt;
        }
    }

    return createDefaultRobotsTxt();
};
