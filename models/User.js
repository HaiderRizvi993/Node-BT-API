const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const { Schema, model } = mongoose;

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
},
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Password Encryption using bcrypt.
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Match password user entered password.
userSchema.methods.matchPassword = async function( enteredPassword ){
    console.log(enteredPassword, this.password);
    
    return await bcrypt.compare( enteredPassword, this.password );
};

//Sign JWT return
userSchema.methods.getSignedJwtToken = function (){
    return jwt.sign({id: this._id},
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};

module.exports = model('User', userSchema);