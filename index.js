const express = require('express');
const mongoose = require('mongoose');

//criar app

const app = express();

//configurar para ler json

app.use(express.urlencoded({
    extended: true,
}))
app.use(express.json());

//conexão com banco
let url = "mongodb://localhost:27017/"
mongoose.connect(url).then(()=>{

    console.log("Já tem banco, pode sentar")
    //Hello world
app.get('/', (rep, res)=>{
    res.json({message: "Olá, mundo!"});

})
}).catch((err)=>{

    console.log("Não tem banco, fica em pé")
})



app.listen(3000)