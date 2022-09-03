const mongoose = require('../databases/index')
const bcrypt = require('bcryptjs')


const LivroSchema = new mongoose.Schema({
    title : {
        type: String,
        require : true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    subTitle:{
        type:String
    },
    tags:{
        type: String
    },
    processing: {
        type: String
    }

});



const Livro = mongoose.model('Livro', LivroSchema)


module.exports = Livro;