const pkg = require('./package.json');
const { jwt } = require('./settings.json');
const jsonWebToken = require('jsonwebtoken');
const humanTime = require('human-time');
const Valkyrie = require('aws-valkyrie');
const app = new Valkyrie();
const startDate = new Date();

const db = require('./db.js');

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

function authMid(req, res, next) {
    jsonWebToken.verify(req.cookies.auth, jwt.secret, (err, decoded) => {
        if(!err) {
            req.user = decoded.data;
        }
        next();
    })
}

app.get('/', (req, res)=> {
    res.json({
        name: pkg.name,
        version: pkg.version,
        startDate,
        uptime: humanTime((new Date - startDate) / 1000)
    });
});

exposeCrud('tags');

exposeCrud('articles');

exposeList('articles_tags_th');

const sendError = (res, status, message) => res.status(status).json({status, message});
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) return sendError(res, 400, 'bad request, missing username or password');

    db.getUser(username, password, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if(!results) return res.status(404).send();
        
        var expriy = new Date();
        expriy.setDate(expriy.getDate() + jwtConfig["life-time-days"]);
      
        const token = jsonWebToken.sign({
            exp: Math.floor(expriy / 1000),
            data: results[0]
        }, jwt.secret);
      
        res.cookie("auth", token, {expires: expriy, httpOnly: true, sameSite: 'strict'}).send();
    });
});

app.all('*', (req, res) => {
    res.status(404).json( {
        status: 404,
        message: 'Pagina non trovata'
    });
});

exports.handler = (...args) => app.listen(...args);

function formatResponse(req, data) {
    const limit = req.limit;
    const skip = req.skip;
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
        db.list(tableName, req.limit, req.skip, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(formatResponse(req, results));
        });
    });
}

function hasPermission(permissionRequired, permissions) {
    for (let i = 0; i < permissions.length; i++) {
        const perm = permissions[i];
        if(perm === '*' || perm === permissionRequired) return true;
    }
    return false;
}

function exposeCrud(tableName) {
    exposeList(tableName);

    app.get(`/${tableName}/:alias`, (req, res) => {
        db.get(tableName, req.params.alias, (error, results) => {
            if (err) return res.status(500).json({ error });
            if(!results.length) return res.status(404).json({
                'message': 'Not found!'
            });
            res.json(results[0]);
        });
    });

    app.post(`/${tableName}`, authMid, (req, res) => {
        if(!req.user) return res.status(401).send();
        if(!hasPermission('article.create', req.user.permissions)) return res.status(403).send();
        db.insert(tableName, req.body, (error, results) => {
            if (error) return res.status(500).json({ error });
            res.json(results);
        });
    });

    app.put(`/${tableName}/:alias`, authMid, (req, res) => {
        if(!req.user) return res.status(401).send();
        if(!hasPermission('article.update', req.user.permissions)) return res.status(403).send();

        db.update(tableName, req.params.alias, req.body, (error, results)  => {
            if (error) return res.status(500).json({ error });
            res.json(results);
        });
    });

    app.delete(`/${tableName}/:alias`, authMid, (req, res) => {
        if(!req.user) return res.status(401).send();
        if(!hasPermission('article.delete', req.user.permissions)) return res.status(403).send();

        db.deleteRow(tableName, req.params.alias, req.body, (error, results) => {
            if (error) return res.status(500).json({ error });
            res.json(results);
        });
    });
}
