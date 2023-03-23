const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

        email: { type: String, required: true},
        age: { type: Number, required: true},
        password: {type: String, required: true},

});



module.exports = mongoose.model('User', userSchema)