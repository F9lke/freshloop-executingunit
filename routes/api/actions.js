const express = require('express');
const router = express.Router();
const passport = require('passport');
const MotorController = require('../../util/motor');

// Load Validation
const validateSprayParams = require('../../validation/spray');

/**
 * @route   GET api/actions/test
 * @desc    Tests the actions module
 * @access  public
 */
router.get('/test', (req, res) => res.json({ msg: "Actions module is ready to serve requests." }));

/**
 * @route   POST api/actions/spray
 * @desc    Sprays the fragrance sitting at the first position
 * @access  private
 */
router.post("/spray", passport.authenticate('jwt', { session: false }), (req, res) => {
	// Signal success
	res.status(200).json({ success: true });
	
	// Issue commands to the trigger motor
	const Motor = new MotorController();
	Motor.triggerMotorSprayAtPosition(1, () => {});
});

/**
 * @route   POST api/actions/sprayAtPosition
 * @desc    Sprays the fragrance sitting at a certain position
 * @access  private
 */
router.post('/sprayAtPosition', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Run Validation
	const { errors, isValid } = validateSprayParams(req.body);
	
	// Check validation
	if(!isValid) {
		return res.status(400).json(errors);
	} else {
		res.status(200).json({ success: true });
	}
	
	// Issue commands to the motors
	const Motor = new MotorController();
	Motor.triggerMotorSprayAtPosition(req.body.position, () => {});
});

module.exports = router;