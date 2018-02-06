const Valkyrie = require('aws-valkyrie');
const app = new Valkyrie();
const pkg = require('./package.json');

//body parser middleware; it will become an external module;
app.use((req, res, next) => {
  try {
    if (req.get('content-type').toLowerCase().includes('application/json')) {
      req.body = JSON.parse(req.body);
    }
  }
  catch (ignore) {}
  next();
});

app.post('/payload-test', (req, res) => res.json(Object.assign({digestedBy: 'Valkyrie'}, req.body)));

app.get('/info', (req, res) => res.json(pkg));

app.get('/home', (req, res) => res.send('hello world'));

app.all('*', (req, res) => res.sendStatus(404));

exports.handler = (...args) => app.listen(...args);
