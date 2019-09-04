const { JMdictUtil, objectToJson } = require('./index');
const fs = require('fs');

/**
 * @param {string[]} args
 */
module.exports = function(args) {
    let mode = args[2];

    if (mode !== 'toJSON' && mode !== 'toSQLite') {
        console.error('Wrong mode, please use "toJSON" or "toSQLite" mode.');
        return;
    }

    if (mode === 'toSQLite') {
        console.error('"toSQLite" mode is currently unavailable.');
        return;
    }

    if (args.length !== 5) {
        console.error('Wrong arguments');
        console.log('Correct examples:');
        console.log('   npx jmdict-util toJSON ./JMdict_e ./dist');
        return;
    }

    let source = args[3];
    let destination = args[4];

    if (!fs.existsSync(source) || fs.existsSync(source) && !fs.lstatSync(source).isFile()) {
        console.error('Wrong source');
        return;
    }

    if (fs.existsSync(destination) && !fs.lstatSync(destination).isDirectory()) {
        console.error('Wrong destination');
        return;
    }

    if (!fs.existsSync(destination)) fs.mkdirSync(destination);

    let jmdict = new JMdictUtil(source);

    // Exporting JSON
    objectToJson(jmdict.getJMdictEntries(), destination + '/JMdictEntries.json');
    objectToJson(jmdict.getKanjiArray(),    destination + '/KanjiArray.json');
    objectToJson(jmdict.getKanjiIndex(),    destination + '/KanjiIndex.json');
    objectToJson(jmdict.getReadingArray(),  destination + '/ReadingArray.json');
    objectToJson(jmdict.getReadingIndex(),  destination + '/ReadingIndex.json');
}