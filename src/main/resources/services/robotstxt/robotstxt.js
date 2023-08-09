const libs = {
    portal: require('/lib/xp/portal')
};

function handleGet(req) {

    const siteConfig = libs.portal.getSiteConfig();

    log.info(JSON.stringify(siteConfig, null, 4));

    if (req.headers.accept && req.headers.accept.indexOf('Application/json') > -1) {
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

function writeGroupTxt(group) {
    var body = "";

    if (Array.isArray(group.userAgent)) {
        group.userAgent.forEach(function (userAgent) {
            body += `User-agent: ${userAgent}\n`;
        });
    } else {
        body += `User-agent: ${group.userAgent}\n`;
    }

    if (Array.isArray(group.allow)) {
        group.allow.forEach(function (allow) {
            body += `Allow: ${allow}\n`;
        });
    } else {
        body += `Allow: ${group.allow}\n`;
    }

    if (Array.isArray(group.disallow)) {
        group.disallow.forEach(function (disallow) {
            body += `Disallow: ${disallow}\n`;
        });
    } else {
        body += `Disallow: ${group.disallow}\n`;
    }

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
    if (config.groups && config.groups.length) {
        var groups = [];
        config.groups.forEach(function (group) {
            groups.push(getGroupData(group));
        });

        const data = {
            rules: groups,
        }

        if (config.sitemap) {
            data.sitemap = config.sitemap;
        }

        return data;
    } else {
        const data = {
            rules: getGroupData(config.groups)
        }
        if (config.sitemap) {
            data.sitemap = config.sitemap;
        }

        return data;
    }
}

function getGroupData(group) {
    return {
        userAgent: group.userAgent || [],
        allow: group.allow || [],
        disallow: group.disallow || []
    }
}
