/* eslint-env node, mocha */
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

if (!fs.existsSync(`${path}/test_temp`)) fs.mkdirSync(`${path}/test_temp`);

// Fixtures

const kanjiSamples = ['食べる', '高等学校', '果物', '飛行機', '今日', '東京', '根本', '根元'];
Object.freeze(kanjiSamples);
const readingSamples = ['たべる', 'こうとうがっこう', 'くだもの', 'ひこうき', 'きょう', 'とうきょう', 'こんぽん', 'こんげん', 'ねもと', 'じゃあ'];
Object.freeze(readingSamples);

// Test Suites

describe('Testing jmdict-util', function () {
  describe('JMdictUtil API', testApiJMdictUtil);
  describe('objectToJson API', testApiObjectToJson);

  const jsonValidityCheck = (/** @type {string} */ jsonFolder) => {
    it('should export JMdictEntries.json correctly', function () {
      const JMdictEntries = JSON.parse(fs.readFileSync(`${jsonFolder}/JMdictEntries.json`, 'utf8'));
      assert.deepStrictEqual(Array.isArray(JMdictEntries), true);

      JMdictEntries.forEach((/** @type {Object} */ entry) => {
        assert.deepStrictEqual(Array.isArray(entry.ent_seq), true);
        assert.deepStrictEqual(Array.isArray(entry.r_ele), true);
        assert.deepStrictEqual(Array.isArray(entry.sense), true);
      });
    });

    it('should export KanjiArray.json correctly', function () {
      const KanjiArray = JSON.parse(fs.readFileSync(`${jsonFolder}/KanjiArray.json`, 'utf8'));
      assert.deepStrictEqual(Array.isArray(KanjiArray), true);

      kanjiSamples.forEach((/** @type {string} */ kanjiSample) => {
        assert.deepStrictEqual(KanjiArray.includes(kanjiSample), true);
      });

      readingSamples.forEach((/** @type {string} */ readingSample) => {
        assert.deepStrictEqual(KanjiArray.includes(readingSample), false);
      });
    });

    it('should export KanjiIndex.json correctly', function () {
      const KanjiIndex = JSON.parse(fs.readFileSync(`${jsonFolder}/KanjiIndex.json`, 'utf8'));
      assert.deepStrictEqual(KanjiIndex === Object(KanjiIndex), true);

      kanjiSamples.forEach((/** @type {string} */ kanjiSample) => {
        assert.deepStrictEqual(Array.isArray(KanjiIndex[kanjiSample]), true);
        assert.notDeepStrictEqual(Number(KanjiIndex[kanjiSample][0]), NaN);
      });

      readingSamples.forEach((/** @type {string} */ readingSample) => {
        assert.deepStrictEqual(KanjiIndex[readingSample], undefined);
      });
    });

    it('should export ReadingArray.json correctly', function () {
      const ReadingArray = JSON.parse(fs.readFileSync(`${jsonFolder}/ReadingArray.json`, 'utf8'));
      assert.deepStrictEqual(Array.isArray(ReadingArray), true);

      readingSamples.forEach((/** @type {string} */ readingSample) => {
        assert.deepStrictEqual(ReadingArray.includes(readingSample), true);
      });

      kanjiSamples.forEach((/** @type {string} */ kanjiSample) => {
        assert.deepStrictEqual(ReadingArray.includes(kanjiSample), false);
      });
    });

    it('should export ReadingIndex.json correctly', function () {
      const ReadingIndex = JSON.parse(fs.readFileSync(`${jsonFolder}/ReadingIndex.json`, 'utf8'));
      assert.deepStrictEqual(ReadingIndex === Object(ReadingIndex), true);

      readingSamples.forEach((/** @type {string} */ readingSample) => {
        assert.deepStrictEqual(Array.isArray(ReadingIndex[readingSample]), true);
        assert.notDeepStrictEqual(Number(ReadingIndex[readingSample][0]), NaN);
      });

      kanjiSamples.forEach((/** @type {string} */ kanjiSample) => {
        assert.deepStrictEqual(ReadingIndex[kanjiSample], undefined);
      });
    });
  };

  describe('JSON exporting features', function () {
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

    jsonValidityCheck(`${path}/test_temp/json`);
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

    jsonValidityCheck(`${path}/test_temp/cli_json`);
  });

  after(function () {
    console.log('(Please delete ./test_temp folder.)');
  });
});
