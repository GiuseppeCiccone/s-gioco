const ejs = require('ejs');
const fs = require('fs');
const axios = require('axios');
const host = 'https://hbj2gyrf5l.execute-api.eu-west-1.amazonaws.com/production';
const file = process.argv[2];
const type = process.argv[3];

const originalHtml = fs.readFileSync(file, { encoding: 'utf8' });

template(type, originalHtml).then( res => {
  console.log(res.data.data);
  const templateData = {};
  templateData[type] = res.data.data;
  fs.writeFileSync('./templated/' +  type + '.html', ejs.render(originalHtml, templateData), { encoding: 'utf8' });
});

function template(type, html) {
  if(type === 'articles') {
    return axios.get(host + '/articles');
  } else if(type === 'tags') {
    return axios.get(host + '/tags');
  }
}
