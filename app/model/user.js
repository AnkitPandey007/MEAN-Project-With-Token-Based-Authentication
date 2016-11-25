// This fie is creating the new schema in our database
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs"); // This module is basically used for the hashing and encryption

var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false }
});

// Do something before save
UserSchema.pre("save", function(next){
	var user = this; // here this keyword will refer UserSchema
	if (!user.isModified("password")) return next();

	// Encrypting
	bcrypt.hash(user.password, null, null,  function(err, hash){
		if (err){
			return next(err);
		}
		user.password = hash;
		next();
	});

});

// crating a custom mrthod for schema
UserSchema.methods.comparePassword = function(password){

	var user = this;
	return bcrypt.compareSync(password, user.password);
	 
}
module.exports = mongoose.model("User", UserSchema);