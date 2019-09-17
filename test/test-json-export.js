/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

const path = process.cwd();

const fs = require('fs');
const assert = require('assert');
const { execSync } = require('child_process');

const {
  JMdictUtil,
  objectToJson,
} = require('../index');

module.exports.testJsonExport = function () {
  before('creating json folder', function () {
    if (fs.existsSync(`${path}/test_temp/json`)) {
      throw new Error('./test_temp/json folder exists, please delete and rerun the test.');
    } else {
      fs.mkdirSync(`${path}/test_temp/json`);
    }
  });

  it('exports JSON files', function () {
    this.slow(60000);
    this.timeout(300000);

    const jmdict = new JMdictUtil(`${path}/test/fixtures/JMdict_e_test`);

    objectToJson(jmdict.getJMdictEntries(), `${path}/test_temp/json/JMdictEntries.json`);
    objectToJson(jmdict.getEntityDefinitions(), `${path}/test_temp/json/EntityDefinitions.json`);
    objectToJson(jmdict.getKanjiArray(), `${path}/test_temp/json/KanjiArray.json`);
    objectToJson(jmdict.getKanjiIndex(), `${path}/test_temp/json/KanjiIndex.json`);
    objectToJson(jmdict.getReadingArray(), `${path}/test_temp/json/ReadingArray.json`);
    objectToJson(jmdict.getReadingIndex(), `${path}/test_temp/json/ReadingIndex.json`);

    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/json/JMdictEntries.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/json/EntityDefinitions.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/json/KanjiArray.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/json/KanjiIndex.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/json/ReadingArray.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/json/ReadingIndex.json`), true);
  });
};

module.exports.testJsonExportCLI = function () {
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

    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/cli_json/JMdictEntries.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/cli_json/EntityDefinitions.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/cli_json/KanjiArray.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/cli_json/KanjiIndex.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/cli_json/ReadingArray.json`), true);
    assert.deepStrictEqual(fs.existsSync(`${path}/test_temp/cli_json/ReadingIndex.json`), true);
  });
};
