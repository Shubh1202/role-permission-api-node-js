const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs")
const validator = require("validator")
const jsonwebtoken = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v){
                return true
            },
            message: "Enter valid email address"
        },
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    role:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        required: true
    }],
},{
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if(!this.password){
        next()
    }

    this.password = await bcryptjs.hashSync(this.password, +process.env.PASSWORD_SALT)
    next()
})

userSchema.methods.comparePassword = (async function(password){
    return await bcryptjs.compareSync(password, this.password)
})


userSchema.methods.generateToken = (async function(){
    const accessToken = await jsonwebtoken.sign(
        {id: this._id}, 
        process.env.ACCESS_TOKEN_KEY, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES, 
            algorithm: process.env.ACCESS_TOKEN_ALGO
        }
    )
    return accessToken
})
module.exports = mongoose.model("users", userSchema, 'users')