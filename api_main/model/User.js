const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    chip:{
        type: Number,
        default: 0
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    birthday: {
        type: String,
    },
    gender: {
        type: String,
    },
    address: {
        type: String,
        default: ""
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    img:{
        type:String,
    },
    refreshToken: [String]
},
{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);