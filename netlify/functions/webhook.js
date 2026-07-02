exports.handler = async function(event, context) {
  // El webhook solo escucha, no verifica al usuario todavía
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Aquí solo confirmamos que recibimos el aviso de Hotmart
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Notificación de compra recibida correctamente" })
  };
};
