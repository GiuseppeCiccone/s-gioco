const mysql  = require('mysql');

const poolConfig = Object.assign(datasource, {
    connectionLimit : 10
});

const pool = mysql.createPool(poolConfig);

export function list(tableName, limit, skip, cb) {
    pool.query(`SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${skip}`, cb);
}

export function get(tableName, alias, cb) {
    pool.query(`SELECT * FROM ${tableName} WHERE alias=?`, alias, cb);
}

export function insert(tableName, body, cb) {
    pool.query(`INSERT INTO ${tableName} SET ?`, body, cb);
}

export function update(tableName, alias, body, cb) {
    pool.query(`UPDATE ${tableName} SET ? WHERE alias=?`, [body, alias], cb);
}

export function deleteRow(tableName, alias, cb) {
    pool.query(`DELETE FROM ${tableName} WHERE alias=?`, alias, cb);
}

export function getArticle(alias, cb) {
	return get('articles', alias, cb);
}

export function listArticles(limit, skip, cb) {
    return list('articles', limit, skip, cb);
}

export function insertArticle(body, cb) {
	return insert('articles', body, cb);
}

export function updateArticle(alias, body, cb) {
    return update('articles', alias, body, cb);
}

export function deleteArticle(alias, cb) {
    return insert('articles', alias, cb);
}

export function listTags(limit, skip, cb) {
    return list('tags', limit, skip, cb);
}

export function getTag(alias, cb) {
    return get('tags', alias, cb);
}

export function insertTag(body, cb) {
    return insert('tags', body, cb);
}

export function updateTag(alias, body, cb) {
    return update('tags', alias, body, cb);
}

export function deleteTag(alias, cb) {
    return insert('tags', alias, cb);
}

export function listArticlesTagsTh(limit, skip, cb) {
    return list('articles_tags_th', limit, skip, cb);
}



