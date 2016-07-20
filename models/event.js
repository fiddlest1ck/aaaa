const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
	title: { type: String },
	start: { type: String },
	end: { type: String },
	user: { type: String}
});

module.exports = mongoose.model('Event', EventSchema);