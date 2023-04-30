import * as functions from "firebase-functions";
import express from "express";

import router from "./api";
import { admin } from "./config/firebase"

const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    res.status(403).send("Unauthorized");
    return;
  }
  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    //@ts-ignore
    req.user = decodedIdToken;
    next();
    return;
  } catch (e) {
    res.status(403).send("Unauthorized");
    return;
  }
};

app.use(authenticate);

app.use("/", router);

app.use("/qwer", (req, res) => {
  res.send("alo")
} )

exports.app = functions.https.onRequest(app);
