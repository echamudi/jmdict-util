const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const parser = require('xml2json');
const console = require('console');

class JMdictUtil {
    /**
     * @param {string} path
     */
    constructor(path) {
        /** @type {string} */
        this.data = fs.readFileSync(path, 'utf8');

        /** @type {{JMdict: [{entry: entry[]}]}} */
        this.jmdictObj;
        /** @type {Object} */
        this.kanjiIndex;
        /** @type {Object} */
        this.kanjiArray;
        /** @type {Object} */
        this.readingIndex;
        /** @type {Object} */
        this.readingArray;
    }

    /**
     * @returns {{JMdict: [{entry: entry[]}]}}
     */
    getJMdictObject() {
        if (this.jmdictObj) return this.jmdictObj;

        // @ts-ignore
        this.jmdictObj = parser.toJson(this.data, {
            object: true,
            arrayNotation: true,
        });

        return this.jmdictObj;
    }

    /**
     * @returns {entry[]}
     */
    getJMdictEntries() {
        const jmdictObject = this.getJMdictObject();
        return jmdictObject.JMdict[0].entry;
    }

    /**
     * @returns {Object}
     */
    getKanjiIndex() {
        if (this.kanjiIndex) return this.kanjiIndex;

        /** @type {Object} */
        let fin = {};

        const jmdictEntries = this.getJMdictEntries();

        for (let jmdictEntry of jmdictEntries) {
            const entSeq = jmdictEntry.ent_seq[0];

            if (!jmdictEntry.k_ele) continue;

            for (let k_ele of jmdictEntry.k_ele) {
                if (fin[k_ele.keb[0]]) {
                    fin[k_ele.keb[0]].push(entSeq);
                } else {
                    fin[k_ele.keb[0]] = [entSeq];
                }
            }
        }

        this.kanjiIndex = fin;

        return this.kanjiIndex;
    }

    /**
     * @returns {Object}
     */
    getKanjiArray() {
        return Object.keys(this.getKanjiIndex());
    }

    /**
     * @returns {Object}
     */
    getReadingIndex() {
        if (this.readingIndex) return this.readingIndex;

        /** @type {Object} */
        let fin = {};

        const jmdictEntries = this.getJMdictEntries();

        for (let jmdictEntry of jmdictEntries) {
            const entSeq = jmdictEntry.ent_seq[0];

            if (!jmdictEntry.r_ele) continue;

            for (let r_ele of jmdictEntry.r_ele) {
                if (fin[r_ele.reb[0]]) {
                    fin[r_ele.reb[0]].push(entSeq);
                } else {
                    fin[r_ele.reb[0]] = [entSeq];
                }
            }
        }

        this.readingIndex = fin;

        return this.readingIndex;
    }

    /**
     * @returns {Object}
     */
    getReadingArray() {
        return Object.keys(this.getReadingIndex());
    }

    /**
     * @param {string} pathFolder 
     */
    buildEntryJsons(pathFolder) {
        const jmdictEntries = this.getJMdictEntries();

        jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];
            const writeLocation = `${pathFolder}/ent_seq_${entSeq}.json`;

            fs.writeFileSync(
                writeLocation,
                JSON.stringify(jmdictEntry, null, 2),
                'utf8'
            );
        });
    }

    /**
     * @param {string} path target DB export
     */
    buildSqlite(path) {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(path)) throw Error(`DB File ${path} already exists, please delete or change the path.`);

                const jmdictEntries = this.getJMdictEntries();
                const db = new sqlite3.Database(path);

                db.serialize(() => {
                    db.run('CREATE TABLE jsons (ent_seq INTEGER, json TEXT, PRIMARY KEY(`ent_seq`))');
                    db.run('CREATE TABLE vocabs (`kanji` TEXT, `reading` TEXT, `ent_seq` INTEGER, `pop` INTEGER, PRIMARY KEY(`kanji`,`reading`,`ent_seq`))');
                    db.run('CREATE TABLE gists (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
                });

                db.parallelize(() => {

                    // jsons
                    for (let jmdictEntry of jmdictEntries) {
                        const entSeq = jmdictEntry.ent_seq[0];

                        db.run("INSERT INTO jsons VALUES (?, ?)", 
                            entSeq, 
                            JSON.stringify(jmdictEntry, null, 0)
                            );
                    }

                    // vocabs
                    for (let jmdictEntry of jmdictEntries) {
                        const entSeq = jmdictEntry.ent_seq[0];

                        /** @type {Object} */
                        let obj = {};

                        // If vocab has kanji
                        if (jmdictEntry.k_ele) {
                            for (let k_ele of jmdictEntry.k_ele) {
                                db.run(
                                    "INSERT INTO vocabs VALUES (?, ?, ?, ?)", 
                                    k_ele.keb[0], 
                                    "test", 
                                    entSeq, 
                                    0
                                    );
                            }
                        };
                    }

                });

                db.close(() => {
                    resolve();
                });

            } catch (err) {
                reject(err);
            }
        });
    }
}
module.exports = JMdictUtil;