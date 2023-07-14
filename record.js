const mongoose = require('mongoose');
const Student = require('./models/stud');


mongoose.connect('mongodb://localhost:27017/score')
.then(() => {
    console.log("Connection OPEN!!!")
})
.catch(err => console.log(err))

const record = [
    {
        name: 'Saad Ahmed',
        enroll: '026',
        score: 100
    },
    {
        name: 'Muneeb Ahmed',
        enroll: '123',
        score: 100
    }
]
Student.insertMany(record)
.then((res)=> {
    console.log(res);
})
.catch((err)=> {
    console.log(err);
})