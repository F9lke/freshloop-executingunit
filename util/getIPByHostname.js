const { execSync } = require('child_process');

const getIPByHostname = hostname => {
	let cmd = `ping -c1 -n ${hostname} | head -n1 | sed "s/.*(\\([0-9]*\\.[0-9]*\\.[0-9]*\\.[0-9]*\\)).*/\\1/g"`;
	
	return execSync(cmd).toString();
};

module.exports = getIPByHostname;