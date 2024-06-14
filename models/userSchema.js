const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, require: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
})

const User = mongoose.model('User', userSchema)

module.exports = User
