import * as admin from "firebase-admin";
// import serviceAccount from "../../firebase_secret.json";

const firebaseAdmin: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SECRET!)),
});

export default firebaseAdmin;
