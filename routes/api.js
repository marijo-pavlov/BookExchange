var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jwt-simple');

var User = require('../models/user');
var Book = require('../models/book');
var BookRequest = require('../models/bookrequest');

const jwtSecretToken = 'n3tnr3it4t54mgrg';

router.post('/register', function(req, res, next){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password;

	req.checkBody('email', 'Email field is required.').notEmpty();
	req.checkBody('email', 'Email not valid.').isEmail();
	req.checkBody('username', 'Username field is required.').notEmpty();
	req.checkBody('password', 'Password field is required.').notEmpty();
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		return res.json({
				success: false,
				errors: errors
				});
	}else{
		var newUser = new User({
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			return res.json({
					success: true
					});
		});
	}


});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log("User not found!");
				return done(null, false);
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					console.log("User found and same password");
					return done(null, user);
				}
				else {
					console.log("User found but not same password");
					return done(null, false);
				}
			});
		});
	}
));

router.post('/login', function(req, res, next){
	passport.authenticate('local', function(error, user, info){
		if(error) 
			throw error;
		if(user){
			var payload = {
				iss: user._id
			};
			var token = jwt.encode(payload, jwtSecretToken);
			return res.json({token: token, username: user.username});
		}
		else 
			return res.status(401).end();
	})(req, res, next);
});

router.post('/changepassword', function(req, res, next){
	var token = req.body.token;
	var oldpassword = req.body.oldpassword;
	var newpassword = req.body.newpassword;
	var newpassword2 = req.body.newpassword2;

	req.checkBody('newpassword', 'New Passwords do not match.').equals(req.body.newpassword2);

	var errors = req.validationErrors();

	if(errors){
		return res.json({
				success: false,
				errors: errors
				});
	}else{
		var userId = jwt.decode(token, jwtSecretToken).iss;

		User.checkPassword(userId, oldpassword, function(err, isMatch){
			if(err) throw err;
			if(!isMatch){
				errors = [];
				errors.push({msg: 'It seems that you typed in wrong old password. Please try again.'});
				return res.json({
						success: false,
						errors: errors
						});
			}

			User.changePassword(userId, newpassword, function(err, user){
				if(err) throw err;
				return res.json({
						success: true
						});
			});

		});
	}
});

router.post('/getinfo', function(req, res, next){
		var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

		User.findById(userId, function(err, user){
			if(err) throw err;

			return res.json({
				user:{
					name: user.name,
					email: user.email,
					username: user.username,
					city: user.city,
					state: user.state
				}
			});
		});
});

router.post('/changeinfo', function(req, res, next){
		var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

		var keys = Object.keys(req.body);
		var changeInfo = {};
		keys.forEach(function(element){
			if(req.body[element])
				changeInfo[element] = req.body[element];
		});

		delete changeInfo.token;

		if(changeInfo.email){
			req.checkBody('email', 'Email not valid.').isEmail();

			var errors = req.validationErrors();

			if(errors){
				return res.json({
						success: false,
						errors: errors
						});
			}		
		}

		User.changeInfo(userId, changeInfo, function(err, user){
			if(err) throw err;

			return res.json({
				user: user,
				success: true
			})
		});
});

router.post('/newbook', function(req, res, next){
	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	User.findById(userId, function(err, user){
		if(err) throw err;

		var imageLink;

		if(!req.body.book.volumeInfo || !req.body.book.volumeInfo.imageLinks || !req.body.book.volumeInfo.imageLinks.thumbnail){
			imageLink = 'http://placehold.it/200x200';
		}else{
			imageLink = req.body.book.volumeInfo.imageLinks.thumbnail;
		}

		var newBook = new Book({
			title: req.body.book.volumeInfo.title,
			authors: req.body.book.volumeInfo.authors,
			imageLink: imageLink,
			addedBy: userId
		});

		newBook.save(newBook, function(err){
			if(err) throw err;

			Book.find({addedBy: userId}, function(err, books){
				if(err) throw err;

				return res.json({
					success: true,
					myBooks: books
				});
			});

		})
	});
});

router.post('/getmybooks', function(req, res, next){

	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	User.findById(userId, function(err, user){
		if(err) throw err;

		Book.find({addedBy: userId}, function(err, books){
			if(err) throw err;

			return res.json({
				success: true,
				myBooks: books
			});
		});

	});
});

router.get('/getallbooks', function(req, res, next){
	Book.find({}, function(err, books){
		if(err) throw err;

		return res.json({
			success: true,
			books: books
		});
	});
});

router.post('/proposetrade', function(req, res, next){
	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	// Checking if user with token exists
	User.findById(userId, function(err, user){
		if(err) throw err;

		User.findById(req.body.book.addedBy, function(err, user){
			if(err) throw err;

			var newBookRequest = new BookRequest({
				book: req.body.book._id,
				fromUser: userId,
				toUser: user._id
			});

			newBookRequest.save(newBookRequest, function(err){
				if(err) throw err;
				
				BookRequest.find({toUser: userId}, function(err, recivedRequests){
					if(err) throw err;

					BookRequest.find({fromUser: userId}, function(err, sentRequests){
						if(err) throw err;

						return res.json({
							success: true,
							recivedRequests: recivedRequests,
							sentRequests: sentRequests
						});
					});
				});	
			});
		})
	});
});

router.post('/getrequests', function(req, res, next){
	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	// Checking if user with token exists
	User.findById(userId, function(err, user){
		if(err) throw err;

		BookRequest.find({toUser: userId}, function(err, recivedRequests){
			if(err) throw err;

			BookRequest.find({fromUser: userId}, function(err, sentRequests){
				if(err) throw err;

				return res.json({
					success: true,
					recivedRequests: recivedRequests,
					sentRequests: sentRequests
				});
			});
		});		
	});
});

router.post('/accepttrade', function(req, res, next){
	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	// Checking if user with token exists
	User.findById(userId, function(err, user){
		if(err) throw err;

		BookRequest.findById(req.body.request._id, function(err, bookRequest){
			if(err) throw err;

			Book.findById(bookRequest.book, function(err, book){
				if(err) throw err;

				book.addedBy = req.body.request.fromUser;
				book.save(function(err){
					if(err) throw err;

					BookRequest.remove({book: book._id}, function(err){
						if(err) throw err;

						BookRequest.find({toUser: userId}, function(err, recivedRequests){
							if(err) throw err;

							BookRequest.find({fromUser: userId}, function(err, sentRequests){
								if(err) throw err;

								return res.json({
									success: true,
									recivedRequests: recivedRequests,
									sentRequests: sentRequests
								});
							});
						});		
					})
				});
			});
		});	
	});
});

router.post('/rejecttrade', function(req, res, next){
	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	// Checking if user with token exists
	User.findById(userId, function(err, user){
		if(err) throw err;

		BookRequest.remove({_id: req.body.request._id}, function(err){
			if(err) throw err;

			BookRequest.find({toUser: userId}, function(err, recivedRequests){
				if(err) throw err;

				BookRequest.find({fromUser: userId}, function(err, sentRequests){
					if(err) throw err;

					return res.json({
						success: true,
						recivedRequests: recivedRequests,
						sentRequests: sentRequests
					});
				});
			});		
		})	
	});
});

router.post('/getbooksandrequests', function(req, res, next){
	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	// Checking if user with token exists
	User.findById(userId, function(err, user){
		if(err) throw err;

			Book.find({}, function(err, allBooks){
				if(err) throw err;

				Book.find({addedBy: userId}, function(err, myBooks){
					if(err) throw err;

					BookRequest.find({toUser: userId}, function(err, recivedRequests){
						if(err) throw err;

						BookRequest.find({fromUser: userId}, function(err, sentRequests){
							if(err) throw err;

							return res.json({
								success: true,
								books: allBooks,
								myBooks: myBooks,
								recivedRequests: recivedRequests,
								sentRequests: sentRequests
							});
						});
					});
				});
			});		
	});
});

router.post('/removebook', function(req, res, next){
	var userId = jwt.decode(req.body.token, jwtSecretToken).iss;

	if(!userId)
		res.status(401).end();

	// Checking if user with token exists
	User.findById(userId, function(err, user){
		if(err) throw err;

		Book.findById(req.body.book._id, function(err, book){
			if(err) throw err;

			Book.remove({_id: book._id}, function(err){
				if(err) throw err;

				BookRequest.remove({book: book._id}, function(err){
					if(err) throw err;

					Book.find({addedBy: userId}, function(err, myBooks){

						if(err) throw err;

						return res.json({
							success: true,
							myBooks: myBooks
						});

					});
					
				});


			});
		});
	});
});

module.exports = router;
