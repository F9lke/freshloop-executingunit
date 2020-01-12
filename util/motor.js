const { spawn } = require('child_process');

const QUARTERTURN = 1024;
const HALFTURN = 2048;
const THREEQUARTERTURN = 3072;

/**
 * Motor Class
 *
 * @type {Motor}
 */
module.exports = class Motor {
	
	/**
	 * Motor constructor
	 */
	constructor() {
		this.turnSettingsByPosition = {
			1: {
				turnDistance: 0,
				resetDistance: 0
			},
			2: {
				turnDistance: QUARTERTURN,
				resetDistance: THREEQUARTERTURN
			},
			3: {
				turnDistance: HALFTURN,
				resetDistance: HALFTURN
			},
			4: {
				turnDistance: THREEQUARTERTURN,
				resetDistance: QUARTERTURN
			}
		};
		
		this.turnSpeed = 0.005;
	} // Motor()
	
	/**
	 * Calculates the duration for a rotation process
	 *
	 * @param {Number}  turnDistance        The Distance, the duration is to be calculated for
	 *
	 * @returns {Number}                    The duration in ms
	 */
	getTurnDuration(turnDistance) {
		return ((turnDistance * this.turnSpeed) * 1000) + 10;
	} // Motor.getTurnDuration()
	
	/**
	 * Issues a rotation command to a motor
	 *
	 * @param {Number}   activeMotorID       The number of the motor e.g. {Number} 1 || {Number} 2
	 * @param {Number}   turnDistance        The rotation-distance
	 * @param {Function} callback            The function to be called post execution
	 */
	executeRotationCommand(activeMotorID, turnDistance, callback) {
		const processDuration = this.getTurnDuration(turnDistance);
		const isFirstMotor = parseInt(activeMotorID) === 1;
		
		// Call the python file
		spawn('python', [__dirname + "/rotateMotor.py", isFirstMotor, turnDistance]);
		
		// Delay the callback execution for the time the motor needs to rotate
		setTimeout(() => {
			callback();
		}, processDuration);
	} // Motor.executeRotationCommand
	
	/**
	 * Alias of this.executeRotationCommand() for the specific case of a regular trigger spray
	 *
	 * @param {Number} position
	 * @param {Function} callback
	 */
	triggerMotorSprayAtPosition(position, callback) {
		return this.executeRotationCommand(position, HALFTURN, callback);
	} // Motor.triggerMotorSprayAtPosition()
	
}; // Class Motor