const path = process.cwd();

const { JMdictUtil, objectToJson } = require('../index');
const assert = require('assert');
const console = require('console');
const fs = require('fs');

try {
    if (!fs.existsSync(path + '/test_temp_json')) fs.mkdirSync(path + '/test_temp_json');

    const kanjiSamples = ["食べる", "高等学校", "果物", "飛行機", "今日", "東京"];
    Object.freeze(kanjiSamples);
    const readingSamples = ["たべる", "こうとうがっこう", "くだもの", "ひこうき", "きょう", "とうきょう"];
    Object.freeze(readingSamples);

    // Testing function existence
    assert.deepStrictEqual(typeof JMdictUtil, 'function');
    assert.deepStrictEqual(typeof objectToJson, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getJMdictEntries, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getKanjiIndex, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getKanjiArray, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getReadingIndex, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getReadingArray, 'function');

    let jmdict = new JMdictUtil(path + '/input/JMdict_e');
    
    // Exporting JSON
    objectToJson(jmdict.getJMdictEntries(), path + '/test_temp_json/JMdictEntries.json');
    objectToJson(jmdict.getKanjiArray(),    path + '/test_temp_json/KanjiArray.json');
    objectToJson(jmdict.getKanjiIndex(),    path + '/test_temp_json/KanjiIndex.json');
    objectToJson(jmdict.getReadingArray(),  path + '/test_temp_json/ReadingArray.json');
    objectToJson(jmdict.getReadingIndex(),  path + '/test_temp_json/ReadingIndex.json');
    
    jmdict = null;

    // Check files
    assert.deepStrictEqual(fs.existsSync(path + '/test_temp_json/JMdictEntries.json'), true);
    assert.deepStrictEqual(fs.existsSync(path + '/test_temp_json/KanjiArray.json'), true);
    assert.deepStrictEqual(fs.existsSync(path + '/test_temp_json/KanjiIndex.json'), true);
    assert.deepStrictEqual(fs.existsSync(path + '/test_temp_json/ReadingArray.json'), true);
    assert.deepStrictEqual(fs.existsSync(path + '/test_temp_json/ReadingIndex.json'), true);

    // @ts-ignore
    let JMdictEntries = require(path + '/test_temp_json/JMdictEntries.json');
    assert.deepStrictEqual(Array.isArray(JMdictEntries), true);
    assert.deepStrictEqual(JMdictEntries.length > 100000, true);
    JMdictEntries = null;

    // @ts-ignore
    let KanjiArray = require(path + '/test_temp_json/KanjiArray.json');
    assert.deepStrictEqual(Array.isArray(KanjiArray), true);
    assert.deepStrictEqual(KanjiArray.length > 180000, true);
    for (let kanjiSample of kanjiSamples) {
        assert.deepStrictEqual(KanjiArray.includes(kanjiSample), true);
    }
    for (let readingSample of readingSamples) {
        assert.deepStrictEqual(KanjiArray.includes(readingSample), false);
    }
    KanjiArray = null;

    // @ts-ignore
    let KanjiIndex = require(path + '/test_temp_json/KanjiIndex.json');
    assert.deepStrictEqual(KanjiIndex === Object(KanjiIndex), true);
    assert.deepStrictEqual(Object.keys(KanjiIndex).length > 180000, true);
    for (let kanjiSample of kanjiSamples) {
        assert.deepStrictEqual(Array.isArray(KanjiIndex[kanjiSample]), true);
        assert.notDeepStrictEqual(Number(KanjiIndex[kanjiSample][0]), NaN);
    }
    for (let readingSample of readingSamples) {
        assert.deepStrictEqual(KanjiIndex[readingSample], undefined);
    }
    KanjiIndex = null;

    // @ts-ignore
    let ReadingArray = require(path + '/test_temp_json/ReadingArray.json');
    assert.deepStrictEqual(Array.isArray(ReadingArray), true);
    assert.deepStrictEqual(ReadingArray.length > 180000, true);
    for (let readingSample of readingSamples) {
        assert.deepStrictEqual(ReadingArray.includes(readingSample), true);
    }
    for (let kanjiSample of kanjiSamples) {
        assert.deepStrictEqual(ReadingArray.includes(kanjiSample), false);
    }
    ReadingArray = null;

    // @ts-ignore
    let ReadingIndex = require(path + '/test_temp_json/ReadingIndex.json');
    assert.deepStrictEqual(ReadingIndex === Object(ReadingIndex), true);
    assert.deepStrictEqual(Object.keys(ReadingIndex).length > 180000, true);
    for (let readingSample of readingSamples) {
        assert.deepStrictEqual(Array.isArray(ReadingIndex[readingSample]), true);
        assert.notDeepStrictEqual(Number(ReadingIndex[readingSample][0]), NaN);
    }
    for (let kanjiSample of kanjiSamples) {
        assert.deepStrictEqual(ReadingIndex[kanjiSample], undefined);
    }
    ReadingIndex = null;

    console.log('Done!');
    console.log('(You can delete ./test_temp_json folder)');
} catch (err) {
    console.error(err);
}
