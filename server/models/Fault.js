const mongoose = require('mongoose');

const faultSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  equipment: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Open' }, // Could be 'Open', 'In Progress', 'Resolved'
  priority: { type: String, default: 'Medium' } // Low, Medium, High, Critical
}, { timestamps: true });

module.exports = mongoose.model('fault', faultSchema);