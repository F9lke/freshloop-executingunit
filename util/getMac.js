const osInterfaces = require('os').networkInterfaces();

const macaddr = () => {
	let targetInterface = Object.keys(osInterfaces)[0];
	
	if(osInterfaces[targetInterface][0].internal && Object.keys(osInterfaces).length > 1) {
		targetInterface = Object.keys(osInterfaces)[1];
	}
	
	return osInterfaces[targetInterface][0].mac;
};

module.exports = macaddr;