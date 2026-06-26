exports.handler = async function(event) {
  const cookies = event.headers.cookie || "";
  const tieneAcceso = cookies.includes("acceso=SI");

  const page = event.queryStringParameters.page;

  if (tieneAcceso) {
    return {
      statusCode: 302,
      headers: {
        Location: "/" + page + ".html"
      }
    };
  }

  return {
    statusCode: 302,
    headers: {
      Location: "https://pay.hotmart.com/X106434037V"
    }
  };
};
