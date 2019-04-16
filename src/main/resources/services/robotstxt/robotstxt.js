var libs = {
    portal: require('/lib/xp/portal')
};

function handleGet(req) {

    var siteConfig = libs.portal.getSiteConfig();
    return {
        contentType: 'text/plain',
        body: siteConfig.robotstxt
    };
}
exports.get = handleGet;
