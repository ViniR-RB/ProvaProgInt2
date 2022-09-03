const express = require('express')
const authMiddleware= require('../middlewares/auth')
const Livro = require('../models/livro')



const router = express.Router()

router.use(authMiddleware)

router.get('/', async(req,res) => {
    try{
        const livros = await Livro.find().populate(['user'])
        return res.send({livros})
    }catch(err){
        return res.status(400).send({msg: "Erro em buscar os livros"})
    }
});

router.get('/:livroId', async(req,res) =>{
    try{
        const livro = await Livro.findById(req.params.livroId).populate(['user']);

        return res.send({livro});
    }   catch(err){
        return res.status(400).send({msg: "Erro em carregar os projeto"})
    }
});

router.post('/create', async(req,res) => {
    try{
        const {title,subTitle,tags,processing} = req.body
        const livro = await Livro.create({title,subTitle,tags,processing,user: req.userId})

        return res.send({livro});
    }catch(err){    
        console.log(err)
        res.status(400).send({msg: 'Error em Criar Livro'})
    }
})




module.exports = app => app.use('/livros', router);