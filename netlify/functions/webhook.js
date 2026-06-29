exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const evento = body.event;

    if (evento === 'PURCHASE_APPROVED' || evento === 'PURCHASE_COMPLETE') {
      return {
        statusCode: 200,
        headers: {
          'Set-Cookie': 'acceso=mes1; path=/; max-age=2592000; SameSite=Lax',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch(e) {
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  }
};
