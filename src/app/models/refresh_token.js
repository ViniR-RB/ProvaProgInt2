const mongoose = require('../databases/index')



const RefreshTokenSchema = new mongoose.Schema({
    expireIn:{
        type: Date,
    },
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
},

});



const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema)


module.exports = RefreshToken;