const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FileSchema = new Schema({
	filename: { type: String },
	user: { type: String },
	path: { type: String },
});

module.exports = mongoose.model('File', FileSchema);