import * as admin from "firebase-admin";
import serviceAccount from "../../firebase_secret.json";

const firebaseAdmin: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default firebaseAdmin;
