exports.handler = async function(event, context) {
  const cookies = event.headers.cookie || '';
  const tieneAcceso = cookies.includes('acceso=SI');

  if (!tieneAcceso) {
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://pay.hotmart.com/X106434037V'
      },
      body: ''
    };
  }

  const page = event.queryStringParameters && event.queryStringParameters.page;
  const pages = ['historia', 'espanol', 'matematicas', 'quimica', 'civica'];

  if (!page || !pages.includes(page)) {
    return {
      statusCode: 302,
      headers: { 'Location': '/' },
      body: ''
    };
  }

  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/var/task', page + '.html');

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html
    };
  } catch(e) {
    return {
      statusCode: 404,
      body: 'Página no encontrada'
    };
  }
};
