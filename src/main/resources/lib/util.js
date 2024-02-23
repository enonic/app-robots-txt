exports.forceArray = function (value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
};
