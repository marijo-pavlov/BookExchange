var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.createConnection('mongodb://localhost/voting-app');

var BookSchema = new Schema({
	title: {
		type: String
	},
	authors: {
		type: Array
	},
	imageLink: {
		type: String
	},
	addedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	published: {
		type: Date,
		default: Date.now()
	}
});

var Book = module.exports = mongoose.model('Book', BookSchema);