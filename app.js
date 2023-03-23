const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./user.js');
const Joi = require('joi');

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
res.render('form.ejs').status(200);
})


const schema = Joi.object({

    email: Joi.string().email().required(),
    age: Joi.number().min(18).required(),
    password: Joi.string().min(8).required()

});


const schema2 = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()

});

app.post('/register', async function(req, res) {
const { error, value } = schema.validate(req.body);
const userEmail = req.body.email;
const result = await User.find({ email: userEmail});

if(error){
    return next(new Error(error.details[0].message));
}

if(result){
    res.send('User already exists!');
    return;
}


const user = new User({
    email: req.body.email,
    age: req.body.age,
    password: req.body.password,
});

user.save();

res.redirect('/login');

});



app.get('/login', (req, res) => {

    res.render('login.ejs');

});


app.post('/login', async (req, res) =>{
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const result = await User.find({ email: userEmail, password: userPassword});
    
    schema2.validate(req.body);

    
    console.log(result[0].email);

    console.log(result[0].password);

    if(result[0].email === userEmail && result[0].password === userPassword){
        res.render('home.ejs');
    } else {
        res.send('That username and password does not exist.');
    }


})

app.get('/home', (req, res) => {

    res.render('home.ejs');
})



app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500).send('Something went wrong!');

})



app.listen(3000);







