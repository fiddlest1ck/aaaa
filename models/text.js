const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TextSchema = new Schema({
	name: { type: String },
	text: { type: String },
	user: { type: String },
});

module.exports = mongoose.model('Text', TextSchema);