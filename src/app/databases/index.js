const mongoose = require('mongoose')


mongoose.connect('mongodb://0.0.0.0:2717/');
mongoose.Promise = global.Promise;


module.exports = mongoose;