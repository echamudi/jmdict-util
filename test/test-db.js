const path = process.cwd();

const { JMdictUtil } = require('../index');
const assert = require('assert');
const console = require('console');
const fs = require('fs');

(async function() {
    try {
        if (!fs.existsSync(path + '/test_temp_db')) fs.mkdirSync(path + '/test_temp_db');

        let jmdict = new JMdictUtil(path + '/input/JMdict_e');
        await jmdict.buildSqlite(path + '/test_temp_db/db.db');

    } catch (err) {
        console.error(err);
    }
})();
