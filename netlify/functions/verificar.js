exports.handler = async function(event, context) {
  const cookies = event.headers.cookie || '';
  const tieneAcceso = cookies.includes('acceso=SI');
  
  if (tieneAcceso) {
    return {
      statusCode: 200,
      body: JSON.stringify({ acceso: true })
    };
  }
  
  return {
    statusCode: 401,
    body: JSON.stringify({ acceso: false })
  };
};
