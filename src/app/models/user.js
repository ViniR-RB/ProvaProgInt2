const mongoose = require('../databases/index')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        require : true
    },
    email: {
        type: String,
        require : true,
        unique: true,
        loweracse: true,
    },
    emailCode:{
        type: String,
        select:false
    },
    emailExpire:{
        type: Date,
        select: false,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default : Date.now()
    },
    telefone: {
        type: String,
        required: true,
        select: false
    },
    smsCode: {
        type: String,
        select: false
    },
    smsExpire: {
        type: Date,
        select: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    refreshtoken:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RefreshToken',
    }




});
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    const hashfone = await bcrypt.hash(this.telefone, 10)
    this.telefone = hashfone

    next()
});


const User = mongoose.model('User', UserSchema)


module.exports = User;