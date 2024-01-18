const contextLib = require('/lib/xp/context');

exports.executeInContext = function (project, branch, callbackFn) {
    const oldContext = contextLib.get();
    const defaultRepository = oldContext.repository;
    const defaultBranch = oldContext.branch;

    return contextLib.run({
        repository: project ? `com.enonic.cms.${project}` : defaultRepository,
        branch: branch || defaultBranch,
    }, callbackFn);
};

