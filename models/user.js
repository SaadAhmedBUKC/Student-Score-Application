const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
})
const Val = mongoose.model('Val', userSchema)
module.exports = Val