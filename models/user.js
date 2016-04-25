var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/book-trading-app');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	email: {
		type: String
	},
	password: {
		type: String,
		bcrypt: true
	},
	name: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	}

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;

		callback(null, isMatch);
	});
}

module.exports.checkPassword = function(userId, password, callback){
	User.findOne({_id: userId}, function(err, user){
		if(err) throw err;

		bcrypt.compare(password, user.password, function(err, isMatch){
			if(err) throw err;

			callback(err, isMatch);
		});
	});
}

module.exports.changePassword = function(userId, newPassword, callback){
	bcrypt.hash(newPassword, 10, function(err, hash){
		if(err) throw err;

		User.update({_id: userId}, {password: hash}, callback);
	});
}

module.exports.changeInfo = function(userId, infoObject, callback){
	User.findById(userId, function(err, user){
			if(err) throw err;
			console.log(infoObject);
			User.update({_id: userId}, infoObject, function(err){
				if(err) throw err;

				User.findById(userId, callback);
			})
		});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;

		newUser.password = hash;
		newUser.save(callback);
	});
}