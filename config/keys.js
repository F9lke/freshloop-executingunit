const fs = require('fs');

const rawContent = fs.readFileSync(__dirname + '/store.json');
const { key } = JSON.parse(rawContent);

module.exports = {
	key: key,
	secretOrKey: 'H?VW-§2pf@yT!8{6:9'
};