# JMdict Util

[![Build Status](https://travis-ci.org/ezhmd/jmdict-util.svg?branch=master)](https://travis-ci.org/ezhmd/jmdict-util) [![NPM Downloads](https://img.shields.io/npm/dm/jmdict-util?label=downloads)](https://www.npmjs.com/package/jmdict-util)

Parse JMdict XML file and export to SQLite and JSON files.

> The SQLite exporting feature is functional but deprecated and won't be updated. Please check the newer [Japanese DB Maker](https://github.com/ezhmd/japanese-db-maker) project for better features.

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
| master | [![Build Status](https://travis-ci.org/ezhmd/jmdict-util.svg?branch=master)](https://travis-ci.org/ezhmd/jmdict-util) |
| develop | [![Build Status](https://travis-ci.org/ezhmd/jmdict-util.svg?branch=develop)](https://travis-ci.org/ezhmd/jmdict-util) |

## Authors

* **Ezzat Chamudi** - [ezhmd](https://github.com/ezhmd)

## Licenses

JMdict Util code is released under [MIT](https://opensource.org/licenses/MIT). 

JMdict is available under Creative Commons Attribution-ShareAlike Licence (V3.0). [License Details](http://www.edrdg.org/edrdg/licence.html)

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.