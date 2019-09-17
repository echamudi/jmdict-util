/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

const path = process.cwd();

const fs = require('fs');
const console = require('console');

const {
  testApiJMdictUtil,
  testApiObjectToJson,
} = require('./test-api.js');

const {
  testJsonExport,
  testJsonExportCLI,
} = require('./test-json-export.js');

const {
  testJsonValidity,
} = require('./test-json-validity.js');

const {
  testSqliteExport,
} = require('./test-db.js');

if (!fs.existsSync(`${path}/test_temp`)) fs.mkdirSync(`${path}/test_temp`);

// Test Suites

describe('Testing jmdict-util', function () {
  describe('JMdictUtil API', testApiJMdictUtil);
  describe('objectToJson API', testApiObjectToJson);

  describe('JSON exporting features', testJsonExport);
  describe('JSON validity', function () {
    testJsonValidity(`${path}/test_temp/json`);
  });


  describe('JSON exporting features (CLI)', testJsonExportCLI);
  describe('JSON validity (from CLI)', function () {
    testJsonValidity(`${path}/test_temp/cli_json`);
  });

  describe('SQLite exporting features (CLI)', testSqliteExport);

  after(function () {
    console.log('(Please delete ./test_temp folder.)');
  });
});
