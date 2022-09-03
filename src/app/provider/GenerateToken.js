const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

class GenerateToken{
    async execute(userId){
        return await jwt.sign(userId, authConfig.SECRET, 
    );
    }
}


module.exports = GenerateToken