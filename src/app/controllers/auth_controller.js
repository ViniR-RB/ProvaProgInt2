const express = require('express')
const User = require('../../app/models/user')
const mailer = require('../modules/mailer')
const bcrypt = require('bcryptjs')
const GenerateRefreshToken = require('../provider/GenerateRefreshtoken')
const GenerateToken = require('../provider/GenerateToken')
const RefreshToken = require('../../app/models/refresh_token');


const router = express.Router()





router.post('/signup', async(req,res)=>{
    const {email} = req.body
    try{
        if(await User.findOne({email}))
            return res.status(401).send({msg: "E-mail já cadastrado"})

    
    const user = await User.create(req.body);

    user.password = undefined


        const emailCode = Math.floor(Math.random()*90000) + 10000;
        const now = new Date()
        now.setHours(now.getHours() + 2)
        await User.findByIdAndUpdate(user.id,{
            '$set' : {
                emailCode: emailCode,
                emailExpire: now
            }
        });

       mailer.sendMail({
            to: email,
            from: 'rogerio@gmail.com',
            template: 'auth/activeaccount',
            context: {emailCode} 
        }), (err) => {
            if(err){
                return res.status(400).send({err: "Erro em enviar o código para o e-mail"})
            }
        };
     
       
        const generaRefreshteToken = new GenerateRefreshToken()
        const generateToken = new GenerateToken()

    return res.send({user,token: await generateToken.execute({id: user.id}), refresh_token: await generaRefreshteToken.execute(user.id)});

    

    }catch(err){
        console.log(err)
        await User.findOneAndDelete({email})
        res.status(400).send({msg: "Erro em se registrar"})
    }
});
router.post('/activeFone', async(req,res)=>{
    
    try{
        const {email,telefone} = req.body
        const user = await User.findOne({email}).select('+isActiveFone telefone');
        if(!user){
            return res.send(400).json({msg: "E-mail inválido"})
        }
        const password = await bcrypt.compare(telefone,user.telefone)
        if(!password){
            return res.send(400).msg({msg:"Telefone Inválido"});
        }
        const newsmsCode = Math.floor(Math.random()*9000) + 1000;
        const now = new Date()
        now.setHours(now.getHours() + 2)
        await User.findByIdAndUpdate(user._id,{
            '$set' : {
                smsCode: newsmsCode,
                smsExpire: now,
            }
        });
        console.log(newsmsCode);
        return res.send()






    }catch(err){
        res.send(400).json({msg: "Não foi possível ativar o celular"})
    }
});


router.post('/active' ,async(req,res) => {
    const {email,emailCode} = req.body
    try{
        
        const user = await User.findOne({email}).select('+emailCode emailExpire')
          
        if(user.isActive == true){
            return res.status(400).send({msg: "Conta já ativa"})
        }
        const now = new Date()
        if(now > user.emailExpire){
            await User.findOneAndDelete({email})
            return res.status(400).send({msg:"Código de Verificação inválido, porfavor registar novamente"})
        }
        if(user.emailCode != emailCode){
            return res.status(400).send({msg: "Código inválido"})
        }
        else if(!user){
            return res.status(400).send({msg: "E-mail não encontrado"})
        }
        else{

            await User.findByIdAndUpdate(user.id,{
                '$set' : {
                    isActive: true,
                }
            });
            return res.status(200).send({msg: "Usuario Ativado"});

        }
    }catch(err){
      
        return res.status(400).send({msg: 'Erro em ativar a conta'})
    }
});

router.post('/refresh_token' ,async(req,res) => {
    const { refresh_token } = req.body
    const refreshToken = await RefreshToken.findOne({
        user: refresh_token
    }).select('+_id user');


    if(!refreshToken){
        res.json({error: "Token inválido"})
    }

    const userId = refreshToken.user.toString()
    const generateToken = new GenerateToken()
    const token = await generateToken.execute({user:userId}); 
    const now = new Date()
   
 


    if(now > refreshToken.expireIn ){
        RefreshToken.deleteOne({
            user: refreshToken.user
        })

        const generatedRefreshToken = GenerateRefreshToken()
        const newrefreshToken = await generatedRefreshToken.execute({userId:refreshToken.userId})
        
        return res.json({token, newrefreshToken});
    }


    return res.json({token});
 


    
   
});


router.post('/login', async(req,res)=> {
    try{
        const {email,password} = req.body
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(400).send({msg: "Usuario ou senha incorretos"})
    }
    if(user.isActive == false){
        return res.status(400).send({msg: "Usuario não foi Ativado"})
    }

    if(!await bcrypt.compare(password,user.password))
        return res.status(400).json({msg: "Usuario ou senha incorretos"})

    user.password = undefined

    const generaRefreshteToken = new GenerateRefreshToken()
    const generateToken = new GenerateToken()        

        const refreshToken = await generaRefreshteToken.execute(user.id)
        const token =  await generateToken.execute({userId: user.id})
    res.send({user,token, refreshToken});
    }catch(err){
        console.log(err)
        res.status(400).send({msg: "Não foi possivel logar"})
    }
    
})






module.exports = app => app.use('/auth', router)