const fs = require('fs');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const key = require('../../config/keys').key;
const secretOrKey = require('../../config/keys').secretOrKey;

// Load Validation
const validateAuthParams = require('../../validation/auth');

/**
 * @route   GET api/auth/test
 * @desc    Tests the authentication module
 * @access  public
 */
router.get('/test', (req, res) => res.json({ msg: "Authentication module is ready to serve requests." }));

/**
 * @route   POST api/auth/authenticate
 * @desc    The api part to the authentication process
 * @access  public
 */
router.post('/authenticate', (req, res) => {
	// Run Validation
	const { errors, isValid } = validateAuthParams(req.body);
	
	// Check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}
	
	// If there is already a secret registered and it was modified within the life span of the jwt, cancel
	if(key.length >= 1 && typeof key === "string") {
		const fileStats = fs.statSync(__dirname + "/../../config/store.json");
		const fileLastModified = fileStats.mtime;
		
		if((new Date().getTime() / 1000 - fileLastModified.getTime() / 1000) <= 29030400) {
			return res.status(500).json({ message: "This unit is already authenticated" });
		}
	}
	
	// Extract the secret
	const secret = req.body.secret;
	
	// Hash the given secret with this units mac address
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(secret, salt, (err, hashedSecret) => {
			if(err) {
				return res.status(400).json(err);
			}
			
			// Store the hash
			const packedData = {};
			packedData.key = hashedSecret;
			
			const newStoreContent = JSON.stringify(packedData, null, 4);
			fs.writeFileSync(__dirname + '/../../config/store.json', newStoreContent);
			
			// Sign a corresponding JsonWebToken and return the token
			jwt.sign(
				{ key: secret },
				secretOrKey,
				{ expiresIn: 29030400 },
				(err, token) => {
					res.json({
						success: true,
						token: 'Bearer ' + token
					});
				}
			);
		});
	});
});

/**
 * @route   DELETE api/auth/terminate
 * @desc    Deletes any token or trace referencing to the once established connection
 * @access  private
 */
router.delete('/terminate', passport.authenticate('jwt', { session: false }), (req, res) => {
	const storePath = __dirname + '/../../config/store.json';
	
	// Delete the store.json file so its filestats won't show any edits (@see api/auth/authenticate)
	fs.unlink(storePath, err => {
		if(err) return res.status(400).json({ err: err });
		
		// Recreate the file with a boilerplate content
		fs.writeFile(storePath, JSON.stringify({ key: "" }), err => {
			if(err) return res.status(400).json({ err: err });
			else return res.status(200).json({ success: true });
		})
	});
});

module.exports = router;