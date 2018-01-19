const mysql  = require('mysql');
const crypto = require('crypto');
const { datasource } = require('./settings.json');
const sha256 = (text) => crypto.createHash('sha256').update(text).digest();

const poolConfig = Object.assign(datasource, {
    connectionLimit : 10
});

const pool = mysql.createPool(poolConfig);

exports.list = function(tableName, limit, skip, cb) {
    pool.query(`SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${skip}`, cb);
}

exports.get = function(tableName, alias, cb) {
    pool.query(`SELECT * FROM ${tableName} WHERE alias=?`, alias, cb);
}

exports.insert = function(tableName, body, cb) {
    pool.query(`INSERT INTO ${tableName} SET ?`, body, cb);
}

exports.update = function(tableName, alias, body, cb) {
    pool.query(`UPDATE ${tableName} SET ? WHERE alias=?`, [body, alias], cb);
}

exports.deleteRow = function(tableName, alias, cb) {
    pool.query(`DELETE FROM ${tableName} WHERE alias=?`, alias, cb);
}

exports.getArticle = function(alias, cb) {
	return get('articles', alias, cb);
}

exports.listArticles = function(limit, skip, cb) {
    return list('articles', limit, skip, cb);
}

exports.insertArticle = function(body, cb) {
	return insert('articles', body, cb);
}

exports.updateArticle = function(alias, body, cb) {
    return update('articles', alias, body, cb);
}

exports.deleteArticle = function(alias, cb) {
    return insert('articles', alias, cb);
}

exports.listTags = function(limit, skip, cb) {
    return list('tags', limit, skip, cb);
}

exports.getTag = function(alias, cb) {
    return get('tags', alias, cb);
}

exports.insertTag = function(body, cb) {
    return insert('tags', body, cb);
}

exports.updateTag = function(alias, body, cb) {
    return update('tags', alias, body, cb);
}

exports.deleteTag = function(alias, cb) {
    return insert('tags', alias, cb);
}

exports.listArticlesTagsTh = function(limit, skip, cb) {
    return list('articles_tags_th', limit, skip, cb);
}

exports.getUser = function(username, password, cb) {
    pool.query('SELECT username,permissions FROM users WHERE username=? and password=?', [username, sha256(password)], cb);
}
