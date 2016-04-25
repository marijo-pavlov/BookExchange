var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.createConnection('mongodb://localhost/voting-app');

var BookRequestSchema = new Schema({
	book: {
		type: Schema.Types.ObjectId,
		ref: 'Book'
	},
	fromUser: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	toUser: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now()
	}
});

var BookRequest = module.exports = mongoose.model('BookRequest', BookRequestSchema);