/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

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

if (!fs.existsSync(`${path}/test_temp`)) fs.mkdirSync(`${path}/test_temp`);

describe('DB exporting features', function () {
  before('creating db folder', function () {
    if (fs.existsSync(`${path}/test_temp/db`)) {
      throw new Error('db folder exists, please delete and rerun the test.');
    } else {
      fs.mkdirSync(`${path}/test_temp/db`);
    }
  });

  it('exports DB', async function () {
    this.timeout(3600000);

    // const jmdict = new JMdictUtil(`${path}/JMdict_e`);
    const jmdict = new JMdictUtil(`${path}/test/fixtures/JMdict_e_test`);

    await jmdict.buildSqlite('./test_temp/db/db.db');
  });
});
