/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

// npx mocha ./test/test-db.js

const path = process.cwd();
const assert = require('assert');
const fs = require('fs');
const { execSync } = require('child_process');

module.exports.testSqliteExport = function () {
  before('creating db folder', function () {
    if (fs.existsSync(`${path}/test_temp/cli_sqlite`)) {
      throw new Error('cli_sqlite folder exists, please delete and rerun the test.');
    } else {
      fs.mkdirSync(`${path}/test_temp/cli_sqlite`);
    }
  });

  it('exports SQLite file', function () {
    this.slow(60000);
    this.timeout(300000);

    execSync('jmdict-util sqlite ./test/fixtures/JMdict_e_test -d ./test_temp/cli_sqlite');

    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/cli_sqlite/jmdict.db`), true);
  });
};
