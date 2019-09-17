/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

// npx mocha ./test/test-db.js

const path = process.cwd();
const fs = require('fs');
const { execSync } = require('child_process');

module.exports.testSqliteExport = function () {
  before('creating db folder', function () {
    if (fs.existsSync(`${path}/test_temp/db`)) {
      throw new Error('db folder exists, please delete and rerun the test.');
    } else {
      fs.mkdirSync(`${path}/test_temp/db`);
    }
  });

  it('exports SQLite file', function () {
    this.slow(60000);
    this.timeout(300000);

    execSync('jmdict-util sqlite ./test/fixtures/JMdict_e_test -d ./test_temp/db');
  });
};
