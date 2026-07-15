const admin = require("firebase-admin");
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "maestrodebolsillo-8ade1",
  });
}
const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const body = JSON.parse(event.body);
    const email = body?.data?.buyer?.email?.toLowerCase?.()?.trim?.();

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email no encontrado" }) };
    }

    // Marca el acceso específico para Reto de Materias (pago único)
    await db.collection("accesos").doc(email).set(
      {
        producto: "reto_de_materias",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Acceso a Reto de Materias registrado para ${email}` }),
    };
  } catch (e) {
    console.error("Error en webhook de Reto de Materias:", e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
