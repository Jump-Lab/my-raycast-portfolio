import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json";
console.log("Log ~ serviceAccount:", serviceAccount)

admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

const db = admin.firestore();

export { admin, db };
