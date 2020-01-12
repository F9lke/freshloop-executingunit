const isEmpty = require('./is-empty');

module.exports = function validateAuthParams(data) {
	let errors = {};
	
	data.secret = !isEmpty(data.secret) ? data.secret : "";
	
	if(data.secret === "") {
		errors.secret = "The secret must be a sized value.";
	}
	
	return {
		errors,
		isValid: isEmpty(errors)
	}
};