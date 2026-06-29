exports.handler = async function(event, context) {
  const cookies = event.headers.cookie || '';
  const page = event.queryStringParameters && event.queryStringParameters.page;

  const tieneAccesoMes1 = cookies.includes('acceso=mes1') || cookies.includes('acceso=mes2');
  const tieneAccesoMes2 = cookies.includes('acceso=mes2');

  const pagesMes1 = ['historia', 'espanol', 'matematicas', 'quimica', 'civica'];
  const pagesMes2 = ['historia_mes2', 'espanol_mes2', 'matematicas_mes2', 'quimica_mes2', 'civica_mes2'];

  if (pagesMes1.includes(page) && !tieneAccesoMes1) {
    return {
      statusCode: 302,
      headers: { 'Location': 'https://pay.hotmart.com/X106434037V' },
      body: ''
    };
  }

  if (pagesMes2.includes(page) && !tieneAccesoMes2) {
    return {
      statusCode: 302,
      headers: { 'Location': 'https://pay.hotmart.com/X106434037V' },
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
