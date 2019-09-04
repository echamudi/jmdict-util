# JMdict Util

Export JMdict into JSON various files and SQLite.
(The SQLite exporting feature is currently under heavy development and unstable)

## How to Use

1. Download [JMdict_e.gz](http://www.edrdg.org/jmdict/edict_doc.html).

1. Extract the `.gz`, move the `JMdict_e` file to an empty folder.

1. Open that folder in terminal.

1. Run following command

    ```sh
    npx jmdict-util toJSON ./JMdict_e ./result
    ```

1. Your JSON files are ready!

## Development

## Testing

Put `JMdict_e` inside `./input` folder. And then, run:

```sh
npm run test-json
```