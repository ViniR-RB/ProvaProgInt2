const RefreshToken = require('../../app/models/refresh_token')

class GenerateRefreshToken{
   
    async execute(userId){
        const expireIn = new Date()
        expireIn.setHours(expireIn.getHours() + 0,1)
        const generaRefreshteToken = await RefreshToken.create({
            
                expireIn,
                user: userId
            
        });
        return generaRefreshteToken
    }
}

module.exports = GenerateRefreshToken;