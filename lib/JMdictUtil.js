const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const parser = require('xml2json');
const console = require('console');

class JMdictUtil {
  /**
   * @param {string} path
   */
  constructor(path, shortEntities = true) {
    // Properties

    /** @type {string} */
    this.data = null;
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

    // Constructor script
    this.load(path, shortEntities);
  }

  /**
   * Load JMdict_e file
   * @param {string} path
   * @param {boolean} shortEntities
   * If true, the entities will be the short version.
   * ("adj-ix" vs "adjective (keiyoushi) - yoi/ii class")
   * @returns {void}
   */
  load(path, shortEntities = true) {
    /** @type {string} */
    this.data = fs.readFileSync(path, 'utf8');

    // remove entities
    if (shortEntities) {
      this.data = this.data.replace(/<!ENTITY (.*?) "(.*?)">/g, '<!ENTITY $1 "$1">');
    }
  }

  /**
   * Get JMdict Object
   * @private
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
   * @private
   * @param {Array<string>} argPriArray
   * @returns {number}
   */
  static priCalc(argPriArray) {
    let priArray = argPriArray;

    if (priArray === undefined || priArray === null) {
      // eslint-disable-next-line no-param-reassign
      priArray = [];
    }

    let priNum = 0;

    // news
    if (priArray.indexOf('news1') !== -1) priNum += 0;
    else if (priArray.indexOf('news2') !== -1) priNum += 12001;
    else priNum += 24001;

    // ichi
    if (priArray.indexOf('ichi1') !== -1) priNum += 0;
    else if (priArray.indexOf('ichi2') !== -1) priNum += 9401;
    else priNum += 9501;

    // spec
    if (priArray.indexOf('spec1') !== -1) priNum += 0;
    else if (priArray.indexOf('spec2') !== -1) priNum += 1601;
    else priNum += 3201;

    // gai
    if (priArray.indexOf('gai1') !== -1) priNum += 0;
    else if (priArray.indexOf('gai2') !== -1) priNum += 4200;
    else priNum += 4410;

    // nf
    const nfCheck = /** @type {[string] | []} */ (priArray.filter((el) => {
      if (el.slice(0, 2) === 'nf') return true;
      return false;
    }));

    if (nfCheck.length === 1) {
      const nfNum = Number(nfCheck[0].slice(2, 4)); // Get the number from "nfxx"
      priNum += ((nfNum - 1) * 500 + 1);
    } else {
      priNum += 23541;
    }

    return priNum;
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
          db.run('CREATE TABLE vocabs (`ent_seq` INTEGER, `kanji` TEXT, `reading` TEXT, `pri_point` INTEGER, `sense` INTEGER, PRIMARY KEY(`ent_seq`, `kanji`,`reading`))');
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

          let prevEntSeq = -1;

          // vocabs
          jmdictEntries.forEach((jmdictEntry) => {
            const entSeq = jmdictEntry.ent_seq[0];
            // console.log(`==${entSeq}==`);

            /** @type {[number, string, string, number, string][]}
             *         ent_seq, kanji, reading, pri_point, sense */
            const vocabRows = [];

            // Check unsorted entSeq in xml
            if (entSeq < prevEntSeq) {
              console.error(`entseq ${entSeq}: unsorted`);
            }
            prevEntSeq = entSeq;

            // Calculate reading element priority points
            /** @type {Object.<string, number>} */
            const rElePriPoints = {};
            jmdictEntry.r_ele.forEach((rEle) => {
              const rElePriPoint = JMdictUtil.priCalc(rEle.re_pri);

              rElePriPoints[rEle.reb[0]] = rElePriPoint;
            });

            // If vocab has kanji element
            if (jmdictEntry.k_ele) {
              jmdictEntry.k_ele.forEach((kEle) => {
                const keb = kEle.keb[0];
                const kElePriPoint = JMdictUtil.priCalc(kEle.ke_pri);

                jmdictEntry.r_ele.forEach((rEle) => {
                  /** @type {string} kanji reading */
                  const reb = rEle.reb[0];

                  /** @type {number} */
                  const priPoint = kElePriPoint > rElePriPoints[reb]
                    ? kElePriPoint : rElePriPoints[reb];

                  // If the reading has no kanji tag
                  if (Object.hasOwnProperty.call(rEle, 're_nokanji')) {
                    vocabRows.push([entSeq, null, reb, priPoint, '']);

                    // If the reading has reading restriction to the kanji
                  } else if (Object.hasOwnProperty.call(rEle, 're_restr')) {
                    if (rEle.re_restr.indexOf(keb) !== -1) {
                      vocabRows.push([entSeq, keb, reb, priPoint, '']);
                    }

                    // If the reading doesn't have tags above,
                    // it applies to all kanji
                  } else {
                    vocabRows.push([entSeq, keb, reb, priPoint, '']);
                  }
                });
              });
            }

            // If the vocab doesn't have kanji element
            if (!jmdictEntry.k_ele) {
              jmdictEntry.r_ele.forEach((rEle) => {
                vocabRows.push([entSeq, null, rEle.reb[0], rElePriPoints[rEle.reb[0]], '']);
              });
            }

            // Add glossaries
            jmdictEntry.sense.forEach((sense) => {
              let glosses = sense.gloss.reduce((ax, gloss) => `${ax}; ${gloss.$t}`, '');
              glosses = glosses.slice(2);
              glosses += '; ';

              const stagk = sense.stagk ? sense.stagk[0] : null;
              const stagr = sense.stagr ? sense.stagr[0] : null;

              vocabRows.forEach((vocabRow) => {
                if (stagk === null && stagr === null) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                } else if (stagk !== null && vocabRow[1] === stagk) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                } else if (stagr !== null && vocabRow[2] === stagr) {
                  // eslint-disable-next-line no-param-reassign
                  vocabRow[4] += glosses;
                }
              });
              // console.log(stagk, stagr, glosses);
            });

            // Put in db
            vocabRows.forEach((row) => {
              // console.log(row);
              db.run('INSERT INTO vocabs VALUES (?, ?, ?, ?, ?)', row);
            });
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
