'use strict';
const pkg     = require('./package.json');
const express = require('express');
const mysql   = require('mysql');
const datasource = require('./datasource.json');

const app = new express();
const startDate = new Date();

const poolConfig = Object.assign(datasource, {
    connectionLimit : 10
});
console.log(poolConfig);
const pool = mysql.createPool(poolConfig);

app.get('/', (req, res)=> {
    res.json({
        name: pkg.name,
        version: pkg.version,
        startDate,
        uptime: new Date() - startDate
    });
});

app.get('/articles', (req, res) => {
    let limit;
    try {
        limit = Number(req.query.limit) || 10;
    } catch(err) {
        limit = 10;
    }

    pool.query(`SELECT * FROM articles LIMIT ${limit}`, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
            count: results.length,
            data: results
        })
    });
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