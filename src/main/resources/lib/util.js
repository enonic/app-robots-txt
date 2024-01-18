exports.forceArray = function (value) {
    return Array.isArray(value) ? value : [value];
};
