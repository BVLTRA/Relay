const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true } 
}, { timestamps: true });

// Hash the password before saving to the database
userSchema.pre('save', async function() {
  // If the password hasn't been changed, just exit the function
  if (!this.isModified('passwordHash')) return;
  
  // Generate the salt and hash the password natively
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare standard passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);