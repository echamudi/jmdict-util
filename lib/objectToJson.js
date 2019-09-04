const fs = require('fs');

/**
 * @param {Object} object 
 * @param {string} path 
 * @param {boolean} beautify 
 */
function objectToJson(object, path, beautify = true) {
    /** @type {number} */
    let space = beautify ? 2 : 0;

    fs.writeFileSync(
        path,
        JSON.stringify(object, null, space),
        'utf8'
    );
}
module.exports = objectToJson;