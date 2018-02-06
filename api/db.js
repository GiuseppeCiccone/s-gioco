const mysql  = require('mysql');
const crypto = require('crypto');
const { datasource } = require('./settings.json');
const sha256 = (text) => crypto.createHash('sha256').update(text).digest();

const poolConfig = Object.assign(datasource, {
    connectionLimit : 10
});

const e = module.exports = {};

const pool = mysql.createPool(poolConfig);

const list = e.list = (tableName, limit, skip, cb) => {
    pool.query(`SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${skip}`, cb);
}

const get = e.get = (tableName, alias, cb) => {
    pool.query(`SELECT * FROM ${tableName} WHERE alias=?`, alias, cb);
}

const insert = e.insert = (tableName, body, cb) => {
    pool.query(`INSERT INTO ${tableName} SET ?`, body, cb);
}

const update = e.update = (tableName, alias, body, cb) => {
    pool.query(`UPDATE ${tableName} SET ? WHERE alias=?`, [body, alias], cb);
}

const deleteRow = e.deleteRow = (tableName, alias, cb) => {
    pool.query(`DELETE FROM ${tableName} WHERE alias=?`, alias, cb);
}

const getUser = e.getUser = (username, password, cb) => {
    pool.query('SELECT username,permissions FROM users WHERE username=? and password=?', [username, sha256(password)], cb);
}

const getArticle = e.getArticle = (alias, cb) => {
	return get('articles', alias, cb);
}

const listArticles = e.listArticles = (limit, skip, cb) => {
    return list('articles', limit, skip, cb);
}

const insertArticle = e.insertArticle = (body, cb) => {
	return insert('articles', body, cb);
}

const updateArticle = e.updateArticle = (alias, body, cb) => {
    return update('articles', alias, body, cb);
}

const deleteArticle = e.deleteArticle = (alias, cb) => {
    return insert('articles', alias, cb);
}

const listTags = e.listTags = (limit, skip, cb) => {
    return list('tags', limit, skip, cb);
}

const getTag = e.getTag = (alias, cb) => {
    return get('tags', alias, cb);
}

const insertTag = e.insertTag = (body, cb) => {
    return insert('tags', body, cb);
}

const updateTag = e.updateTag = (alias, body, cb) => {
    return update('tags', alias, body, cb);
}

const deleteTag = e.deleteTag = (alias, cb) => {
    return insert('tags', alias, cb);
}

const listArticlesTagsTh = e.listArticlesTagsTh = (limit, skip, cb) => {
    return list('articles_tags_th', limit, skip, cb);
}
