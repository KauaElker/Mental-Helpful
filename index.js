const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/IMG', express.static(path.join(__dirname, '/IMG')));
app.use('/K.HTML', express.static(path.join(__dirname, '/K.HTML')));

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '/K.HTML/home.html'));
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;

const routeUsuario = require('./routes/usuario');
app.use('/usuario/',routeUsuario);