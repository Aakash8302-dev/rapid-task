const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
    type: String,
    required: true,
    select: false,
    },
    name: {
    type: String,
    required: true,
    },
},
{ timestamps: true }
)


// Encrypt Password using bcrypt
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
  
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
});
};
  

const User = mongoose.model('User', UserSchema, 'Users');
module.exports = User