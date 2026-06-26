const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {

  const page = event.queryStringParameters.page;

  console.log("__dirname:", __dirname);

  const filePath = path.resolve(__dirname, "..", "..", page + ".html");

  console.log("Ruta:", filePath);

  try {

    const html = fs.readFileSync(filePath, "utf8");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: html
    };

  } catch (e) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
        ruta: filePath,
        dirname: __dirname
      })
    };

  }

};
