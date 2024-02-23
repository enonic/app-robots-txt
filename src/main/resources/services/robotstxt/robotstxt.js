const libs = {
    portal: require('/lib/xp/portal')
};

function handleGet(req) {
    const siteConfig = libs.portal.getSiteConfig();

    if (req.getHeader('accept') && req.getHeader('accept').indexOf('application/json') > -1) {
        return {
            body: JSON.stringify(configToData(siteConfig)),
            contentType: 'application/json'
        }
    } else {
        const data = configToData(siteConfig);

        const body = dataToPlainRobotTxt(data);

        return {
            contentType: 'text/plain',
            body: body
        }
    }
}

exports.get = handleGet;

function dataToPlainRobotTxt(data) {
    let body = "";

    if (Array.isArray(data.rules)) {
        data.rules.forEach(function (group) {
            body += writeGroupTxt(group) + "\n";
        });
    } else {
        body += writeGroupTxt(data.rules) + "\n";
    }

    if (data.sitemap) {
        body += `Sitemap: ${data.sitemap}\n`;
    }

    return body;
}

function forceArray(data) {
    if (Array.isArray(data)) {
        return data;
    } else {
        return [data];
    }
}

function writeGroupTxt(groupRules) {
    let body = "";
    const group = getGroupData(groupRules);

    forceArray(group.userAgent || "*").forEach(function (userAgent) {
        body += `User-agent: ${userAgent}\n`;
    });

    forceArray(group.allow).forEach(function (allow) {
        body += `Allow: ${allow}\n`;
    });

    forceArray(group.disallow).forEach(function (disallow) {
        body += `Disallow: ${disallow}\n`;
    });

    return body;
}

/**
 * Get the app config and convert it to robots data
 *
 * @param {*} config - App config
 * @returns {Object || Array} Groups of robots.txt configuration
 */
function configToData(config) {
    // if it has length == array
    if (!config) {
        return {
            rules: []
        }
    }

    let data;
    if (config.groups && Array.isArray(config.groups)) {
        var groups = [];
        config.groups.forEach(function (group) {
            groups.push(getGroupData(group));
        });

        data = {
            rules: groups,
        }
    } else {
        data = {
            rules: getGroupData(config.groups || {
                userAgent: "*",
                disallow: [""],
            })
        }
    }

    if (config.sitemap) {
        data.sitemap = config.sitemap;
    }

    return data;
}

function getGroupData(group) {
    return {
        userAgent: group && group.userAgent || [],
        allow: group && group.allow || [],
        disallow: group && group.disallow || []
    }
}