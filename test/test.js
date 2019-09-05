/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

const path = process.cwd();

const fs = require('fs');
const console = require('console');
const assert = require('assert');
const {
  describe,
  it,
  before,
  after,
} = require('mocha');
const {
  JMdictUtil,
  objectToJson,
} = require('../index');

const kanjiSamples = ['食べる', '高等学校', '果物', '飛行機', '今日', '東京', '根本', '根元'];
Object.freeze(kanjiSamples);
const readingSamples = ['たべる', 'こうとうがっこう', 'くだもの', 'ひこうき', 'きょう', 'とうきょう', 'こんぽん', 'こんげん', 'ねもと'];
Object.freeze(readingSamples);

describe('Testing jmdict-util', function () {
  describe('JMdictUtil API', function () {
    it('has JMdictUtil function', function () {
      assert.deepStrictEqual(typeof JMdictUtil, 'function');
    });

    it('has all required methods', function () {
      assert.deepStrictEqual(typeof JMdictUtil.prototype.getJMdictEntries, 'function');
      assert.deepStrictEqual(typeof JMdictUtil.prototype.getKanjiIndex, 'function');
      assert.deepStrictEqual(typeof JMdictUtil.prototype.getKanjiArray, 'function');
      assert.deepStrictEqual(typeof JMdictUtil.prototype.getReadingIndex, 'function');
      assert.deepStrictEqual(typeof JMdictUtil.prototype.getReadingArray, 'function');
    });
  });

  describe('objectToJson API', function () {
    it('has objectToJson function', function () {
      assert.deepStrictEqual(typeof objectToJson, 'function');
    });
  });

  describe('JSON exporting features', function () {
    before('creating test_temp_json folder', function () {
      if (fs.existsSync(`${path}/test_temp_json`)) {
        throw new Error('test_temp_json folder exists, please delete and rerun the test.');
      } else {
        fs.mkdirSync(`${path}/test_temp_json`);
      }
    });

    it('exports JSON files', function () {
      this.slow(60000);
      this.timeout(300000);

      const jmdict = new JMdictUtil(`${path}/test/fixtures/JMdict_e_test`);

      objectToJson(jmdict.getJMdictEntries(), `${path}/test_temp_json/JMdictEntries.json`);
      objectToJson(jmdict.getKanjiArray(), `${path}/test_temp_json/KanjiArray.json`);
      objectToJson(jmdict.getKanjiIndex(), `${path}/test_temp_json/KanjiIndex.json`);
      objectToJson(jmdict.getReadingArray(), `${path}/test_temp_json/ReadingArray.json`);
      objectToJson(jmdict.getReadingIndex(), `${path}/test_temp_json/ReadingIndex.json`);

      assert.deepStrictEqual(fs.existsSync(`${path}/test_temp_json/JMdictEntries.json`), true);
      assert.deepStrictEqual(fs.existsSync(`${path}/test_temp_json/KanjiArray.json`), true);
      assert.deepStrictEqual(fs.existsSync(`${path}/test_temp_json/KanjiIndex.json`), true);
      assert.deepStrictEqual(fs.existsSync(`${path}/test_temp_json/ReadingArray.json`), true);
      assert.deepStrictEqual(fs.existsSync(`${path}/test_temp_json/ReadingIndex.json`), true);
    });

    it('should export JMdictEntries.json correctly', function () {
      const JMdictEntries = JSON.parse(fs.readFileSync(`${path}/test_temp_json/JMdictEntries.json`, 'utf8'));
      assert.deepStrictEqual(Array.isArray(JMdictEntries), true);

      JMdictEntries.forEach((/** @type {Object} */ entry) => {
        assert.deepStrictEqual(Array.isArray(entry.ent_seq), true);
        assert.deepStrictEqual(Array.isArray(entry.r_ele), true);
        assert.deepStrictEqual(Array.isArray(entry.sense), true);
      });
    });

    it('should export KanjiArray.json correctly', function () {
      const KanjiArray = JSON.parse(fs.readFileSync(`${path}/test_temp_json/KanjiArray.json`, 'utf8'));
      assert.deepStrictEqual(Array.isArray(KanjiArray), true);

      kanjiSamples.forEach((/** @type {string} */ kanjiSample) => {
        assert.deepStrictEqual(KanjiArray.includes(kanjiSample), true);
      });

      readingSamples.forEach((/** @type {string} */ readingSample) => {
        assert.deepStrictEqual(KanjiArray.includes(readingSample), false);
      });
    });

    it('should export KanjiIndex.json correctly', function () {
      const KanjiIndex = JSON.parse(fs.readFileSync(`${path}/test_temp_json/KanjiIndex.json`, 'utf8'));
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
      const ReadingArray = JSON.parse(fs.readFileSync(`${path}/test_temp_json/ReadingArray.json`, 'utf8'));
      assert.deepStrictEqual(Array.isArray(ReadingArray), true);

      readingSamples.forEach((/** @type {string} */ readingSample) => {
        assert.deepStrictEqual(ReadingArray.includes(readingSample), true);
      });

      kanjiSamples.forEach((/** @type {string} */ kanjiSample) => {
        assert.deepStrictEqual(ReadingArray.includes(kanjiSample), false);
      });
    });

    it('should export ReadingArray.json correctly', function () {
      const ReadingIndex = JSON.parse(fs.readFileSync(`${path}/test_temp_json/ReadingIndex.json`, 'utf8'));
      assert.deepStrictEqual(ReadingIndex === Object(ReadingIndex), true);

      readingSamples.forEach((/** @type {string} */ readingSample) => {
        assert.deepStrictEqual(Array.isArray(ReadingIndex[readingSample]), true);
        assert.notDeepStrictEqual(Number(ReadingIndex[readingSample][0]), NaN);
      });

      kanjiSamples.forEach((/** @type {string} */ kanjiSample) => {
        assert.deepStrictEqual(ReadingIndex[kanjiSample], undefined);
      });
    });
  });

  after(function () {
    console.log('(Please delete ./test_temp_json folder.)');
  });
});
