const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const key = require('../config/keys').key;
const secretOrKey = require('../config/keys').secretOrKey;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = passport => {
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		bcrypt.compare(jwt_payload.key, key)
			.then(isMatch => {
				if(isMatch) {
					return done(null, key);
				} else {
					return done(null, false, { message: 'Unauthorized' });
				}
			})
			.catch(err => console.log(err));
	}));
};