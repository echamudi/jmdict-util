/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

const path = process.cwd();

const fs = require('fs');
const assert = require('assert');

const kanjiSamples = JSON.parse(fs.readFileSync(`${path}/test/fixtures/kanjiSamples.json`, 'utf8'));
const readingSamples = JSON.parse(fs.readFileSync(`${path}/test/fixtures/readingSamples.json`, 'utf8'));

module.exports.testJsonValidity = (/** @type {string} */ jsonFolder) => {
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
