/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

// npx mocha ./test/test-db.js

const path = process.cwd();
const fs = require('fs');
// const console = require('console');
const {
  describe,
  it,
  before,
  // after,
} = require('mocha');
const {
  JMdictUtil,
  // objectToJson,
} = require('../index');

describe('DB exporting features', function () {
  before('creating test_temp_db folder', function () {
    if (fs.existsSync(`${path}/test_temp_db`)) {
      throw new Error('test_temp_db folder exists, please delete and rerun the test.');
    } else {
      fs.mkdirSync(`${path}/test_temp_db`);
    }
  });

  it('exports DB', async function () {
    const jmdict = new JMdictUtil(`${path}/test/fixtures/JMdict_e_test`);

    await jmdict.buildSqlite('./test_temp_db/db.db');
  });
});
