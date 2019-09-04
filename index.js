module.exports = require('./lib/index');

// If CLI
// @ts-ignore
if (require.main === module) {
    let npx = require('./npx');
    npx(process.argv);
}