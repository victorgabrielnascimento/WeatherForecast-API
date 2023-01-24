// Controle do servidor e controle de daddos da API
const path = require('path');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/tempo', async  (req, res) => {
    const data = await axios.get('https://api.weather.gov/gridpoints/TOP/31,80/forecast').then(e => e.data);
    return res.status(200).send(data);
});

app.get('/', async(req, res) => {
    try{
        res.sendFile("/index.html", {root: __dirname});
    }
    catch(err) {
        res.send(err);
    }
});    

app.listen(3030, () => {
    console.log('Sucesso! Serviço na porta 3030!');
});