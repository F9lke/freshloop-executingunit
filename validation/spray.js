const isEmpty = require('./is-empty');

module.exports = function validateSprayParams(data) {
	let errors = {};
	
	data.position = !isEmpty(data.position) ? data.position : "";
	
	if(data.position === "") {
		errors.position = "The position parameter must be a sized value.";
	}
	
	return {
		errors,
		isValid: isEmpty(errors)
	}
};