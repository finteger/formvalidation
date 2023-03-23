const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./user.js');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;



const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

app.set('views', './views');
app.set('view engine', 'ejs');


const url = `mongodb+srv://toddnash:Summer2023@cluster0.ypw5ypl.mongodb.net/users`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect(url, connectionParams)
    .then( () => {
        console.log('Connected to database');
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. ${err}`);
    });



app.get('/register', (req, res) =>{
res.render('form.ejs');
})


const schema = Joi.object({

    email: Joi.string().email().required(),
    age: Joi.number().min(18).required(),
    password: Joi.string().min(8).required()

});


app.post('/register', async function(req, res, next) {

const { error, value } = schema.validate(req.body);

bcrypt.hash(req.body.password, saltRounds, function(err, hash){

if(error){
    return next(new Error(error.details[0].message));
}


const user = new User({
    email: req.body.email,
    age: req.body.age,
    password: hash,
});

user.save();

res.redirect('/login');

});
});



app.get('/login', (req, res) => {

    res.render('login.ejs');

});







app.post('/login', async (req, res) =>{
   
const { email, password } = req.body;

const user = await User.findOne({ email });

if(!user) {
    res.status(401).send({error: 'Invalid Credentials.'});
}

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
  res.status(401).send({error: 'Invalid Credentials.'});
}

const token = jwt.sign({ userId: user._id}, 'secret_key');

res.send({ token });

});






app.get('/home', (req, res) => {

    res.render('home.ejs');
})



app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500).send(err.stack);

})



app.listen(3000);







