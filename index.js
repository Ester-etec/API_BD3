const express = require('express');
const mongoose = require('mongoose');
const Person = require('./models/person');
const crypto = require('crypto');
const { rejects } = require('assert');

//criar app

const app = express();

//configurar para ler json

app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());

//função criptografar o cpf

const cipher = {
    algorithm: 'aes256',
    secret: 'chave',
    type: 'hex'
};

async function getCrypto(cpf) {
    return new Promise((resolve, reject) => {
        const cipherStream = crypto.createCipher(cipher.algorithm, cipher.secret);
        let encryptedData = '';

        cipherStream.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipherStream.read())) {
                encryptedData += chunk.toString(cipher.type);
            }
        });

        cipherStream.on('end', () => {
            resolve(encryptedData);
        });

        cipherStream.on('error', (error) => {
            reject(error);
        });

        cipherStream.write(cpf);
        cipherStream.end();
    });
}

//Rotas

app.post('/person', async (req, res) => {
    let { name, salary, cpf, approved } = req.body;
    try {
        let encryptedCpf = await getCrypto(cpf);

        const person = {
            name,
            salary,
            cpf: encryptedCpf,
            approved,
        };

        try {
            await Person.create(person);
            res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// O R do CRUD

app.get('/person', async (req, res) => {
    try {
        const people = await Person.find()

        res.status(200).json(people)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


//O 

app.get('/person/:id', async (req, res) => {
    const id = req.params.id

    try {
        const person = await Person.findOne({ _id: id})

        if (! person) {
            res.status(422).json({ message: 'Usuário não encontrado!'})
            return
        }
        res.status(200).json(person)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
})

//O U do CRUD

app.patch('/person/:id', async (req, res) => {
    const id = req.params.id

    const { name, salary, cpf, approved } = req.body

    const person = {
        name,
        salary,
        cpf,
        approved,
    }

    try {
        const updatePerson = await Person.updateOne({ _id: id}, person)

        if (updatePerson.matchedCount === 0){
            res.status(422).json({ message: 'Usuário não encontrado!'})
            return
        }
        res.status(200).json(person)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
});

//O D do CRUD
app.delete('/person/:id', async (req, res) => {
    const id = req.params.id

    const person = await Person.findOne({ _id: id})

    if (!person) {
        res.status(422).json({ message: 'Usuário não encontrado!'})
        return
    }

    try {
        const person = await Person.deleteOne({ _id: id})
    
    res.status(200).json(person)
    }catch (error) {
        res.status(500).json({ erro: error })
    }
});


//conexão com banco
let url = "mongodb://localhost:27017/"
mongoose.connect(url).then(()=>{

    console.log("Já tem banco, pode sentar")
    //Hello world
app.get('/', (req, res)=>{
    res.json({message: "Olá, mundo!"});

})
}).catch((err)=>{

    console.log("Não tem banco, fica em pé")
})



app.listen(3000)