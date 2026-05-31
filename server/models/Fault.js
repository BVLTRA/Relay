const mongoose = require('mongoose');

const faultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipment: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Open' },
  priority: { type: String, default: 'Medium' },
  
  // Physical Tag Fields
  shift: { type: String, required: true },
  area: { type: String, required: true },
  dateRaised: { type: Date, required: true },
  tagType: { type: String, required: true },
  actionToBeTaken: { type: String } // Optional field
}, { timestamps: true });

module.exports = mongoose.model('Fault', faultSchema);