const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.models.HomeForm || mongoose.model('HomeForm', homeSchema);
