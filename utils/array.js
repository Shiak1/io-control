function distinctBy(array, key) {
    return distinctByCallback(array, function(item) {
        return item[key];
    });
}

function distinctByCallback(array, callback) {
    var existing = {};

    return array.filter(function(item, index) {
        var value = callback(item, index);

        if (existing.hasOwnProperty(value, index)) {
            return false;
        }

        return (existing[value] = true);
    });
}

Array.prototype.distinct = function(key) {
    if (key && key.constructor === Function) {
        return distinctByCallback(this, key);
    }

    if (arguments.length) {
        return distinctBy(this, key);
    }

    return [...new Set(this)];
};
