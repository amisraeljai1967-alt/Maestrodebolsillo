exports.handler = async function(event, context) {
  const cookies = event.headers.cookie || '';
  const tieneAcceso = cookies.includes('acceso=SI');
  const page = event.queryStringParameters.page;

  if (tieneAcceso) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../../', page + '.html');
    console.log(__dirname);
console.log(filePath);    
    const html = fs.readFileSync(filePath, 'utf8');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html
    };
  }

  return {
    statusCode: 302,
    headers: {
      'Location': 'https://pay.hotmart.com/X106434037V'
    },
    body: ''
  };
};
