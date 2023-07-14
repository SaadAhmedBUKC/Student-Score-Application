const mongoose = require('mongoose');

const studSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: [
        {
            url: String,
            filename: String
        }
    ],
    enroll: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
})

const Student = mongoose.model('Student', studSchema);
module.exports=Student;