#!/usr/bin/env node

const fs = require('fs');
const console = require('console');
const {
  JMdictUtil,
  objectToJson,
} = require('./index');

const args = process.argv;
const mode = args[2];

if (mode !== 'toJSON' && mode !== 'toSQLite') {
  console.error('Wrong mode, please use "toJSON" or "toSQLite" mode.');
  process.exit();
}

if (mode === 'toSQLite') {
  console.error('"toSQLite" mode is currently unavailable.');
  process.exit();
}

if (args.length !== 5) {
  console.error('Wrong arguments');
  console.log('Correct examples:');
  console.log('   npx jmdict-util toJSON ./JMdict_e ./dist');
  process.exit();
}

const source = args[3];
const destination = args[4];

if (!fs.existsSync(source) || (fs.existsSync(source) && !fs.lstatSync(source).isFile())) {
  console.error('Wrong source');
  process.exit();
}

if (fs.existsSync(destination) && !fs.lstatSync(destination).isDirectory()) {
  console.error('Wrong destination');
  process.exit();
}

if (!fs.existsSync(destination)) fs.mkdirSync(destination);

const jmdict = new JMdictUtil(source);

// Exporting JSON
if (mode === 'toJSON') {
  objectToJson(jmdict.getJMdictEntries(), `${destination}/JMdictEntries.json`);
  objectToJson(jmdict.getKanjiArray(), `${destination}/KanjiArray.json`);
  objectToJson(jmdict.getKanjiIndex(), `${destination}/KanjiIndex.json`);
  objectToJson(jmdict.getReadingArray(), `${destination}/ReadingArray.json`);
  objectToJson(jmdict.getReadingIndex(), `${destination}/ReadingIndex.json`);
}
