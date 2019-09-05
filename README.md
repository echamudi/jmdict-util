# JMdict Util

[![Build Status](https://travis-ci.org/ezhmd/jmdict-util.svg?branch=master)](https://travis-ci.org/ezhmd/jmdict-util)

Export JMdict into JSON various files and SQLite.

(The SQLite exporting feature is currently under heavy development)

## Usage

1. Download [JMdict_e.gz](http://www.edrdg.org/jmdict/edict_doc.html).

1. Extract the `.gz`, move the `JMdict_e` file to an empty folder.

1. Open that folder in terminal.

1. Run following command

    ```sh
    npm install jmdict-util
    npx jmdict-util toJSON ./JMdict_e ./result
    ```

1. Your JSON files are ready!

## Development

## Testing

```sh
npm test
```