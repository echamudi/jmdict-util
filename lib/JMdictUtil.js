const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const parser = require('xml2json');

class JMdictUtil {
  /**
   * @param {string} path
   */
  constructor(path) {
    /** @type {string} */
    this.data = fs.readFileSync(path, 'utf8');

    /** @type {JMdict.JMdict} */
    this.jmdictObj = null;
    /** @type {Object.<string, number[]>} */
    this.kanjiIndex = null;
    /** @type {string[]} */
    this.kanjiArray = null;
    /** @type {Object.<string, number[]>} */
    this.readingIndex = null;
    /** @type {string[]} */
    this.readingArray = null;
  }

  /**
   * @returns {JMdict.JMdict}
   */
  getJMdictObject() {
    if (this.jmdictObj) return this.jmdictObj;

    this.jmdictObj = /** @type {JMdict.JMdict} */ (parser.toJson(this.data, {
      object: true,
      arrayNotation: true,
    }));

    return this.jmdictObj;
  }

  /**
   * @returns {JMdict.entry[]}
   */
  getJMdictEntries() {
    const jmdictObject = this.getJMdictObject();
    return jmdictObject.JMdict[0].entry;
  }

  /**
   * @returns {Object.<string, number[]>}
   */
  getKanjiIndex() {
    if (this.kanjiIndex) return this.kanjiIndex;

    this.kanjiIndex = {};

    const jmdictEntries = this.getJMdictEntries();

    jmdictEntries.forEach((jmdictEntry) => {
      const entSeq = jmdictEntry.ent_seq[0];

      if (jmdictEntry.k_ele) {
        jmdictEntry.k_ele.forEach((kEle) => {
          if (this.kanjiIndex[kEle.keb[0]]) {
            this.kanjiIndex[kEle.keb[0]].push(entSeq);
          } else {
            this.kanjiIndex[kEle.keb[0]] = [entSeq];
          }
        });
      }
    });

    return this.kanjiIndex;
  }

  /**
   * @returns {string[]}
   */
  getKanjiArray() {
    return Object.keys(this.getKanjiIndex());
  }

  /**
   * @returns {Object.<string, number[]>}
   */
  getReadingIndex() {
    if (this.readingIndex) return this.readingIndex;

    this.readingIndex = {};

    const jmdictEntries = this.getJMdictEntries();

    jmdictEntries.forEach((jmdictEntry) => {
      const entSeq = jmdictEntry.ent_seq[0];

      if (jmdictEntry.r_ele) {
        jmdictEntry.r_ele.forEach((rEle) => {
          if (this.readingIndex[rEle.reb[0]]) {
            this.readingIndex[rEle.reb[0]].push(entSeq);
          } else {
            this.readingIndex[rEle.reb[0]] = [entSeq];
          }
        });
      }
    });

    return this.readingIndex;
  }

  /**
   * @returns {string[]}
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
        'utf8',
      );
    });
  }

  /**
   * @param {string} path target DB export
   * @returns {Promise}
   */
  buildSqlite(path) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(path)) throw Error(`DB File ${path} already exists, please delete or change the path.`);

        const jmdictEntries = this.getJMdictEntries();
        const db = new sqlite3.Database(path);

        db.serialize(() => {
          db.run('CREATE TABLE jsons (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
          db.run('CREATE TABLE vocabs (`kanji` TEXT, `reading` TEXT, `ent_seq` INTEGER, `pop` INTEGER, PRIMARY KEY(`kanji`,`reading`,`ent_seq`))');
          db.run('CREATE TABLE gists (`ent_seq` INTEGER, `json` TEXT, PRIMARY KEY(`ent_seq`))');
        });

        db.parallelize(() => {
          // jsons
          jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];

            db.run('INSERT INTO jsons VALUES (?, ?)',
              entSeq,
              JSON.stringify(jmdictEntry, null, 0));
          });

          // vocabs
          jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];

            // /** @type {Object} */
            // const obj = {};

            // If vocab doesn't have kanji
            if (!jmdictEntry.k_ele) {
              jmdictEntry.r_ele.forEach((rEle) => {
                db.run('INSERT INTO vocabs VALUES (?, ?, ?, ?)', [
                  null,
                  rEle.reb[0],
                  entSeq,
                  0,
                ]);
              });
            }

            // If vocab has kanji
            if (jmdictEntry.k_ele) {
              /** @type {Object.<string, string[]>} */
              const kanjiWords = {};

              jmdictEntry.k_ele.forEach((kEle) => {
                kanjiWords[kEle.keb[0]] = [];

                // db.run('INSERT INTO vocabs VALUES (?, ?, ?, ?)', [
                //   kEle.keb[0],
                //   'test',
                //   entSeq,
                //   0,
                // ]);
              });
            }
          });
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
