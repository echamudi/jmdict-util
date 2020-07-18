**⚠️ This project has been deprecated**

<p align="center">
  <a href="https://www.npmjs.com/package/japanese-db">
    <img src="https://raw.githubusercontent.com/echamudi/echamudi-docs/master/images/truck-git.svg" width="150" height="200">
  </a>
</p>

The SQLite exporting feature in this project is functional but deprecated and won't be developed further. Please check the newer [Japanese DB](https://www.npmjs.com/package/japanese-db) project for better database exporting features.

**NPM URL:** https://www.npmjs.com/package/japanese-db

**GitHub URL:** https://github.com/echamudi/japanese-toolkit/tree/master/packages/japanese-db

-----
<br>

# JMdict Util

[![Build Status](https://travis-ci.org/echamudi/jmdict-util.svg?branch=master)](https://travis-ci.org/echamudi/jmdict-util) [![NPM Downloads](https://img.shields.io/npm/dm/jmdict-util?label=downloads)](https://www.npmjs.com/package/jmdict-util)

Parse JMdict XML file and export to SQLite and JSON files.

## Usage

1. Download `JMdict_e.gz` from [the website](http://www.edrdg.org/jmdict/edict_doc.html).

1. Extract the `.gz` file, move the `JMdict_e` file in an empty folder.

1. Open that folder in terminal.

1. Run following commands

    ```sh
    npm install -g jmdict-util

    # For exporting to JSON files
    jmdict-util json ./JMdict_e -d ./dist

    # For exporting to SQLite file
    jmdict-util sqlite ./JMdict_e -d ./dist
    ```

## Build Status

| Branch | Status |
| - | - |
| master | [![Build Status](https://travis-ci.org/echamudi/jmdict-util.svg?branch=master)](https://travis-ci.org/echamudi/jmdict-util) |
| develop | [![Build Status](https://travis-ci.org/echamudi/jmdict-util.svg?branch=develop)](https://travis-ci.org/echamudi/jmdict-util) |

## Acknowledgement

- JMdict https://www.edrdg.org/jmdict/j_jmdict.html

## Authors

* **Ezzat Chamudi** - [echamudi](https://github.com/echamudi)

See also the list of [contributors](https://github.com/echamudi/jmdict-util/graphs/contributors) who participated in this project.

## License

Copyright © 2019 Ezzat Chamudi.

JMdict Util code is licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/). Images, logos, docs, and articles in this project are released under [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode).

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.
