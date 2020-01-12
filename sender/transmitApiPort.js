const http = require('http');
const getMac = require('../util/getMac');
const getIPByHostname = require('../util/getIPByHostname');

const transmitApiPort = port => {
	const macaddress = getMac();
	const requestRoute = `/dashboard?page=Admin&action=portInformationReq&api_port=${port}&sender_macaddress=${macaddress}`;
	const target = getIPByHostname("hub.local").replace("\n", "");
	
	const opts = {
		hostname: target,
		path: requestRoute,
		port: 80,
		method: "POST"
	};
	
	const req = http.request(opts, res => {
		console.log('transmitApiPort', res.statusCode, res.statusMessage);
	});
	
	req.end();
};

module.exports = transmitApiPort;