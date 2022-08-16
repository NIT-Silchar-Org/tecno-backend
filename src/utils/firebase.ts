import admin from "firebase-admin";
// import serviceAccount from "../../firebase_secret.json";

let firebaseAdmin: admin.app.App;

const firebaseInit = () => {
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
};

export { firebaseAdmin, firebaseInit };
