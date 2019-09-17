/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

'strict mode';

const assert = require('assert');
const {
  JMdictUtil,
  objectToJson,
} = require('../index');

module.exports.testApiJMdictUtil = function () {
  it('has JMdictUtil function', function () {
    assert.deepStrictEqual(typeof JMdictUtil, 'function');
  });

  it('has all required methods', function () {
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getJMdictEntries, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getEntityDefinitions, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getKanjiIndex, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getKanjiArray, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getReadingIndex, 'function');
    assert.deepStrictEqual(typeof JMdictUtil.prototype.getReadingArray, 'function');
  });
};

module.exports.testApiObjectToJson = function () {
  it('has objectToJson function', function () {
    assert.deepStrictEqual(typeof objectToJson, 'function');
  });
};
