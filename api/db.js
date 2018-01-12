const mysql  = require('mysql');

const poolConfig = Object.assign(datasource, {
    connectionLimit : 10
});

const pool = mysql.createPool(poolConfig);

function get(tableName, alias) {
    pool.query(`SELECT * FROM ${tableName} WHERE alias=?`, alias, (error, results) => {
        if (err) return res.status(500).json({ error });
        if(!results.length) return res.status(404).json({
            'message': 'Not found!'
        });
        res.json(results[0]);
    });
}

function insert(tableName, body) {
    pool.query(`INSERT INTO ${tableName} SET ?`, body, (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json(results);
    });
}

function udate(tableName, alias, body) {
    pool.query(`UPDATE ${tableName} SET ? WHERE alias=?`, [body, alias], (error, results)  => {
        if (error) return res.status(500).json({ error });
        res.json(results);
    });
}

function delete(tableName, alias) {
    pool.query(`DELETE FROM ${tableName} WHERE alias=?`, alias, (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json(results);
    });
}

function getArticle(alias) {
	return get('articles', alias);
}

function insertArticle(body) {
	return insert('articles', body);
}
