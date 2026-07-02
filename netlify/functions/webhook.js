exports.handler = async function(event, context) {
  // 1. Validar el origen: ¿La petición viene de Hotmart?
  const referer = event.headers.referer || '';
  
  if (!referer.includes('hotmart.com')) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Acceso Denegado: Este material solo puede visualizarse dentro de la plataforma.'
    };
  }

  // 2. Lógica de páginas permitidas
  const page = event.queryStringParameters && event.queryStringParameters.page;
  const pagesMes1 = ['historia', 'espanol', 'matematicas', 'quimica', 'civica'];
  const pagesMes2 = ['historia_mes2', 'espanol_mes2', 'matematicas_mes2', 'quimica_mes2', 'civica_mes2'];

  // 3. Verificación de acceso por cookies (mantenemos tu lógica existente)
  const cookies = event.headers.cookie || '';
  const tieneAccesoMes1 = cookies.includes('acceso=mes1') || cookies.includes('acceso=mes2');
  const tieneAccesoMes2 = cookies.includes('acceso=mes2');

  if (pagesMes1.includes(page) && !tieneAccesoMes1) {
    return { statusCode: 302, headers: { 'Location': 'https://pay.hotmart.com/X106434037V' }, body: '' };
  }
  if (pagesMes2.includes(page) && !tieneAccesoMes2) {
    return { statusCode: 302, headers: { 'Location': 'https://pay.hotmart.com/X106434037V' }, body: '' };
  }

  const fs = require('fs');
  const path = require('path');
  const filePath = path.join('/var/task', page + '.html');

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'text/html',
        // Esto le dice al navegador que solo permita cargar esto si está en Hotmart
        'X-Frame-Options': 'ALLOW-FROM https://hotmart.com',
        'Content-Security-Policy': "frame-ancestors 'self' https://app.hotmart.com"
      },
      body: html
    };
  } catch(e) {
    return { statusCode: 404, body: 'Página no encontrada' };
  }
};
