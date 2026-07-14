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
    const mes = body?.data?.purchase?.recurrency_number;

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email no encontrado" }) };
    }
    if (!mes) {
      return { statusCode: 400, body: JSON.stringify({ error: "No se pudo identificar el numero de recurrencia (mes)" }) };
    }

    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
    } catch (e) {
      await db.collection("purchases_pending").doc(email).set(
        {
          meses: admin.firestore.FieldValue.arrayUnion(mes),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Mes ${mes} pendiente para ${email}` }),
      };
    }

    const userDoc = db.collection("usuarios").doc(user.uid);
    await userDoc.set(
      {
        email,
        meses: admin.firestore.FieldValue.arrayUnion(mes),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Mes ${mes} asignado a ${email}` }),
    };
  } catch (e) {
    console.error("Error en webhook:", e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
