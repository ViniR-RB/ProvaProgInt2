const jwt = require("jsonwebtoken");
const User = require('../models/user')
const authConfig = require('../config/auth.json')
module.exports = (req,res,next) => {
    const authHeader = req.headers.authorization;
    const parts = authHeader.split(' ');
    if(!parts === 2){
        return res.status(401).send({msg: "Token Invalid"})
    }
    const [scheme,token] = parts

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({error: "Token malformated"});
    }

    jwt.verify(token,authConfig.SECRET, (err,decoded) => {
        if(err) return res.status(401).send({error: "Token invalid"});
        req.userId = decoded.id;
        return next()
    });
}