# JMdict Util

[![Build Status](https://travis-ci.org/ezhmd/jmdict-util.svg?branch=master)](https://travis-ci.org/ezhmd/jmdict-util) [![NPM Downloads](https://img.shields.io/npm/dm/jmdict-util?label=downloads)](https://www.npmjs.com/package/jmdict-util)

Export JMdict into JSON various files and SQLite.

(The SQLite exporting feature is currently under heavy development)

## Usage

1. Download [JMdict_e.gz](http://www.edrdg.org/jmdict/edict_doc.html).

1. Extract the `.gz`, move the `JMdict_e` file to an empty folder.

1. Open that folder in terminal.

1. Run following command

    ```sh
    npm install jmdict-util
    npx jmdict-util toJSON ./JMdict_e ./dist
    ```

1. Your JSON files are ready!

## Development

## Build Status

| Branch | Status |
| - | - |
| master | [![Build Status](https://travis-ci.org/ezhmd/jmdict-util.svg?branch=master)](https://travis-ci.org/ezhmd/jmdict-util) |
| develop | [![Build Status](https://travis-ci.org/ezhmd/jmdict-util.svg?branch=develop)](https://travis-ci.org/ezhmd/jmdict-util) |

## Testing

```sh
npx . toJSON ./test/fixtures/JMdict_e_test ./test_temp_cli_json
npm test
```

## Authors

* **Ezzat Chamudi** - [ezhmd](https://github.com/ezhmd)

## Licenses

JMdict Util code is released under [MIT](https://opensource.org/licenses/MIT). 

JMdict is available under Creative Commons Attribution-ShareAlike Licence (V3.0). [License Details](http://www.edrdg.org/edrdg/licence.html)

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.