'use strict';
const pkg    = require('./package.json');
const express = require('express');
const mysql  = require('mysql');
const settings = require('./settings.json');
const datasource = settings.datasource;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

const app = new express();
const startDate = new Date();

const poolConfig = Object.assign(datasource, {
    connectionLimit : 10
});

const pool = mysql.createPool(poolConfig);

function paginationMiddleware(req, res, next){
    let limit;
    try {
        limit = Number(req.query.limit) || 10;
    } catch(err) {
        limit = 10;
    }

    if (limit > 100) limit = 100;

    let skip;
    try {
        skip = Number(req.query.skip) || 0;
    } catch(err) {
        skip = 0;
    }

    req.limit = limit;
    req.skip = skip;
    next();
}

app.get('/', (req, res)=> {
    res.json({
        name: pkg.name,
        version: pkg.version,
        startDate,
        uptime: new Date() - startDate
    });
});

exposeCrud('tags');

exposeCrud('articles');

exposeList('articles_tags_th');

app.all('*', (req, res) => {
    res.status(404).json( {
        status: 404,
        message: 'Pagina non trovata'
    });
});

app.listen(8000, () => {
    console.log('Server in ascolto sulla porta 8000')
});

function formatResponse(req, data) {
    const { limit, skip } = req;
    return {
        count: data.length,
        skip,
        limit,
        prevSkip: skip - limit < 0? 0 : skip - limit,
        nextSkip: skip + limit,
        data
    };
}

function exposeList(tableName) {
    app.get(`/${tableName}`, paginationMiddleware, (req, res) => {
        pool.query(`SELECT * FROM ${tableName} LIMIT ${req.limit} OFFSET ${req.skip}`, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(formatResponse(req, results));
        });
    });
}

function exposeCrud(tableName) {
    exposeList(tableName);

    app.get(`/${tableName}/:alias`, (req, res) => {
        pool.query(`SELECT * FROM ${tableName} WHERE alias=?`, req.alias, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    });

    app.post(`/${tableName}`, (req, res) => {
        pool.query('INSERT INTO ${tableName} SET ?', req.body, (error, results) => {
            if (error) return res.status(500).json({ error: err });
            res.json(results);
        });
    });

    app.put(`/${tableName}/:id`, (req, res) => {
        pool.query('UPDATE ${tableName} SET ? WHERE alias=?', [req.body, req.alias], (error, results)  => {
            if (error) return res.status(500).json({ error: err });
            res.json(results);
        });
    });

    app.delete(`/${tableName}/:alias`, (req, res) => {
        pool.query('DELETE FROM ${tableName} WHERE alias=?', [req.body, req.alias], (error, results) => {
            if (error) return res.status(500).json({ error: err });
            res.json(results);
        });
    });
}
