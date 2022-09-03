const express = require('express')
const bodyParser = require('body-parser')


const app = express()


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: false}))


app.get('/', (req,res)=> {
    res.send({msg: "Bem Vindo a Nossa Api"})
})

const port= 3000
require('./app/controllers/index')(app)
app.listen(port, ()=>{
    console.log(`Rodando na porta:${port}`);
})