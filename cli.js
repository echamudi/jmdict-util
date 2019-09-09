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
  .description('Export to packs of json')
  .option('-d, --destination [destination]', 'Destination folder', './')

  .action((source, args) => {
    jmdict = new JMdictUtil(source);

    if (args.destination === undefined) {
      console.error('Please set destination folder');
      process.exit(1);
    }

    if (fs.existsSync(args.destination) && !fs.lstatSync(args.destination).isDirectory()) {
      console.error('Destination is not a directory.');
      process.exit(1);
    }

    if (!fs.existsSync(args.destination)) fs.mkdirSync(args.destination);

    objectToJson(jmdict.getJMdictEntries(), `${args.destination}/JMdictEntries.json`);
    objectToJson(jmdict.getEntityDefinitions(), `${args.destination}/EntityDefinitions.json`);
    objectToJson(jmdict.getKanjiArray(), `${args.destination}/KanjiArray.json`);
    objectToJson(jmdict.getKanjiIndex(), `${args.destination}/KanjiIndex.json`);
    objectToJson(jmdict.getReadingArray(), `${args.destination}/ReadingArray.json`);
    objectToJson(jmdict.getReadingIndex(), `${args.destination}/ReadingIndex.json`);
  });

program.parse(process.argv);
