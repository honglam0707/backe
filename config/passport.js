const {User} = require('../models/u_m');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {secretKey}= require('./key')

let opts=[]
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

module.exports=(passport)=>{
	passport.use(new JwtStrategy(opts,function(jwt_payload,done){
		User.findOne({_id:jwt_payload.id},function(err,user){
			if(err) return done(err,false)
			else if(user) return done(null,jwt_payload)
			else return done(null,false)
		})
	}))
}