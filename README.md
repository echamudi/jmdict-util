# JMdict Util

Export JMdict into JSON various files and SQLite.
(The SQLite exporting feature is currently under heavy development and unstable)

## Usage

```sh
npx jmdict-util toJSON ./JMdict_e ./result
npx jmdict-util toSQLite ./JMdict_e ./result # currently unavailable
```

## Testing

Put `JMdict_e` inside `./input` folder. And then, run:

```sh
npm run test-json
```