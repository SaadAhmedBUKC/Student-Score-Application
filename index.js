if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const { findById } = require('./models/stud');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync')
const bcrypt = require('bcrypt');
const multer  = require('multer')
const { storage } = require('./cloudinary')
const upload = multer({ storage })
const path = require('path')
const flash = require('connect-flash')

const Student = require('./models/stud')
const Val = require('./models/user')

mongoose.connect('mongodb://localhost:27017/score')
.then(() => {
    console.log("Connection OPEN!!!")
})
.catch(err => console.log(err))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'notagoodsecret'}));



app.get('/register', (req, res) => {
    res.render('users/register')
})
app.post('/register', catchAsync(async (req, res) => {
    try{
    const {email, password} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new Val({
        email,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/students');}
    catch(e){
        console.log(e);
        res.redirect('/register');
    }
}))
app.get('/login', (req, res) => {
    res.render('users/login');
})
app.post('/login', catchAsync(async (req, res) => {
    try{
        const {email, password} = req.body;
        const findUser = await Val.findOne({email});
        const valUser = await bcrypt.compare(password, findUser.password);
        if(valUser){
            req.session.findUser_id = findUser._id;
            res.redirect('/students');
        }}
        catch(e){
            res.redirect('/login');
        }
    }
))
app.post('/logout', (req, res) => {
    req.session.user_id=null;
    res.redirect('/login');
})

app.get('/students', async (req, res) => {
    const students = await Student.find({});
    res.render('students/index', {students});
})
app.get('/students/new', async (req, res) => {
    res.render('students/new');
})
app.post('/students', upload.array('image', 12), async(req, res) => {
    const newStudent = new Student(req.body);
    newStudent.image = req.files.map((f) => ({url: f.path, filename: f.filename}));
    await newStudent.save();
    res.redirect(`/students/${newStudent._id}`);
})
app.get('/students/:id', async (req, res) => {
    const {id} = req.params;
    const student = await Student.findById(id);
    res.render('students/details', {student});
})
app.get('/students/:id/edit', async (req, res) => {
    const {id} = req.params;
    const student = await Student.findById(id);
    res.render('students/edit', {student});
})
app.put('/students/:id', async (req, res) => {
    const {id} = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/students/${student._id}`);
})
app.delete('/students/:id', async (req, res) => {
    const {id} =req.params;
    const student = await Student.findByIdAndDelete(id);
    res.redirect('/students');
})



app.listen(3000, () => {
    console.log('at 3000');
})