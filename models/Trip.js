const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  startPoint: String,
  endPoint: String,
  ticketFee: Number,
});

module.exports = mongoose.model('Trip', tripSchema);
