#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const {
  JMdictUtil,
  objectToJson,
} = require('./index');

let jmdict = null;

program
  .command('json <source>')
  .alias('toJSON')
  .description('Export JMdict XML to various json files.')
  .option('-d, --destination <destination>', 'Destination folder')

  .action((source, args) => {
    jmdict = new JMdictUtil(source);

    if (!fs.existsSync(args.destination)) fs.mkdirSync(args.destination, { recursive: true });

    objectToJson(jmdict.getJMdictEntries(), `${args.destination}/JMdictEntries.json`);
    objectToJson(jmdict.getEntityDefinitions(), `${args.destination}/EntityDefinitions.json`);
    objectToJson(jmdict.getKanjiArray(), `${args.destination}/KanjiArray.json`);
    objectToJson(jmdict.getKanjiIndex(), `${args.destination}/KanjiIndex.json`);
    objectToJson(jmdict.getReadingArray(), `${args.destination}/ReadingArray.json`);
    objectToJson(jmdict.getReadingIndex(), `${args.destination}/ReadingIndex.json`);
  });

program
  .command('sqlite <source>')
  .alias('toSQLite')
  .description('Export JMdict XML to SQLite database.')
  .option('-d, --destination <destination>', 'Destination folder')
  .action((source, args) => {
    jmdict = new JMdictUtil(source);

    if (!fs.existsSync(args.destination)) fs.mkdirSync(args.destination, { recursive: true });

    jmdict.buildSqlite(`${args.destination}/jmdict.db`);
  });

program.parse(process.argv);
