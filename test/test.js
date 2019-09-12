/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

const path = process.cwd();

const fs = require('fs');
const console = require('console');
const assert = require('assert');
const { execSync } = require('child_process');

const {
  JMdictUtil,
  objectToJson,
} = require('../index');

const {
  testApiJMdictUtil,
  testApiObjectToJson,
} = require('./test-api.js');

const {
  testJsonExport,
} = require('./test-json-export.js');

const {
  testJsonValidity,
} = require('./test-json-validity.js');

if (!fs.existsSync(`${path}/test_temp`)) fs.mkdirSync(`${path}/test_temp`);

// Test Suites

describe('Testing jmdict-util', function () {
  describe('JMdictUtil API', testApiJMdictUtil);
  describe('objectToJson API', testApiObjectToJson);

  describe('JSON exporting features', testJsonExport);

  describe('JSON validity', function () {
    testJsonValidity(`${path}/test_temp/json`);
  });

  describe('JSON exporting features (from CLI)', function () {
    before('creating cli_json folder', function () {
      if (fs.existsSync(`${path}/test_temp/cli_json`)) {
        throw new Error('./test_temp/cli_json folder exists, please delete and rerun the test.');
      } else {
        fs.mkdirSync(`${path}/test_temp/cli_json`);
      }
    });

    it('exports JSON files', function () {
      this.slow(60000);
      this.timeout(300000);

      execSync('jmdict-util json ./test/fixtures/JMdict_e_test -d ./test_temp/cli_json');
    });

    testJsonValidity(`${path}/test_temp/cli_json`);
  });

  after(function () {
    console.log('(Please delete ./test_temp folder.)');
  });
});
