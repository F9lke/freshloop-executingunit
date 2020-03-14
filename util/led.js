const { spawn } = require('child_process');

const LEFT_MOTOR_LED_PIN = 20;
const RIGHT_MOTOR_LED_PIN = 21;

/**
 * LED Class
 *
 * @type {LED}
 */
module.exports = class LED {
	
	/**
	 * LED constructor
	 */
	constructor() {
		this.shiningLEDs = [];
	} // LED()
	
	/**
	 * Powers on an led light
	 *
	 * @param {Number} ledPosition
	 * @param {Function} callback
	 *
	 * @returns {boolean}
	 */
	lightLED(ledPosition = 1, callback) {
		// If the led is already powered on, cancel
		if(this.shiningLEDs.indexOf(ledPosition) !== -1) return false;
		
		// Store the led as 'currently glowing'
		this.shiningLEDs.push(ledPosition);
		
		// Call the python file
		spawn('python', [
			__dirname + "/ledAction.py",
			true,
			(ledPosition === 1 ? LEFT_MOTOR_LED_PIN : RIGHT_MOTOR_LED_PIN)
		]);
		
		// Run the callback
		if(callback instanceof Function) callback();
	} // LED.lightLED()
	
	/**
	 * Powers off an led light
	 *
	 * @param {Number} ledPosition
	 *
	 * @returns {boolean}
	 */
	darkenLED(ledPosition = 1) {
		const ledIndexInShiningLEDs = this.shiningLEDs.indexOf(ledPosition);
		
		// Remove the led from the 'currently glowing' ones
		if(ledIndexInShiningLEDs === -1) return false;
		else this.shiningLEDs.splice(ledIndexInShiningLEDs, 1);
		
		// Power off the led
		spawn('python', [
			__dirname + "/ledAction.py",
			false,
			(ledPosition === 1 ? LEFT_MOTOR_LED_PIN : RIGHT_MOTOR_LED_PIN)
		]);
	} // LED.darkenLED()

}; // class LED