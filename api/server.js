'use strict';
const express = require('express');
const app = new express();

app.get('/ciaone', (req, res) => {
   console.log(req.headers);
   res.json(req.headers);
});

app.get('/', (req, res)=> {
    res.send('<h1>ciao! sono la home page!</h1>')
});

app.all('*', (req, res) => {
   res.status(404).json( {
       status: 404,
       message: 'Pagina non trovata'
   });
});

app.listen(8000, () => {
    console.log('Server in ascolto sulla porta 8000')
});