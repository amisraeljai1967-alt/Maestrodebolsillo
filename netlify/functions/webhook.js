const admin = require("firebase-admin");
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "maestrodebolsillo-8ade1",
  });
}
const db = admin.firestore();

// Mapeo de mes calendario (0=enero...11=diciembre) al "Mes" del ciclo escolar
// Septiembre=Mes1, Octubre=Mes2, ... Mayo=Mes9. Jun/Jul/Ago = sin acceso (fuera de ciclo).
const MAPEO_MES_ESCOLAR = {
  8: 1,  // septiembre
  9: 2,  // octubre
  10: 3, // noviembre
  11: 4, // diciembre
  0: 5,  // enero
  1: 6,  // febrero
  2: 7,  // marzo
  3: 8,  // abril
  4: 9,  // mayo
  // 5 (junio), 6 (julio), 7 (agosto) -> fuera de ciclo, no mapeados
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const body = JSON.parse(event.body);
    const email = body?.data?.buyer?.email?.toLowerCase?.()?.trim?.();
    const approvedDateMs = body?.data?.purchase?.approved_date || body?.data?.purchase?.order_date;

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email no encontrado" }) };
    }
    if (!approvedDateMs) {
      return { statusCode: 400, body: JSON.stringify({ error: "No se encontro la fecha de aprobacion del pago" }) };
    }

    const fechaPago = new Date(approvedDateMs);
    const mesCalendario = fechaPago.getMonth(); // 0-11
    const mes = MAPEO_MES_ESCOLAR[mesCalendario];

    if (!mes) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Pago recibido fuera del ciclo escolar (mes calendario ${mesCalendario + 1}). No se asigna ningun mes.` }),
      };
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
