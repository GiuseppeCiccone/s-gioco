const mysql  = require('mysql');

const poolConfig = Object.assign(datasource, {
    connectionLimit : 10
});

const pool = mysql.createPool(poolConfig);

function list(tableName, limit, skip) {
    pool.query(`SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${skip}`, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(formatResponse(req, results));
    });
}


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

function listArticles() {
    return list('articles');
}

function insertArticle(body) {
	return insert('articles', body);
}

function updateArticle(alias, body) {
    return update('articles', alias, body);
}

function deleteArticle(alias) {
    return insert('articles', alias);
}

function listTags() {
    return list('tags');
}

function getTag(alias) {
    return get('tags', alias);
}

function insertTag(body) {
    return insert('tags', body);
}

function updateTag(alias, body) {
    return update('tags', alias, body);
}

function deleteTag(alias) {
    return insert('tags', alias);
}

function listArticlesTagsTh() {
    return list('articles_tags_th');
}



