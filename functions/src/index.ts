import * as functions from "firebase-functions";
import express from "express";

import router from "./api";
import { verify } from "./utils/google";

const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const idToken = req.query.id_token as string;
  if (!idToken) {
    console.error("No id_token");
    return res.status(403).send("Unauthorized");
  }
  try {
    const user = await verify(idToken);
    console.log("User ID:", user?.sub);
    //@ts-ignore
    req.user = user;
    return next();
  } catch (e) {
    return res.status(403).send("Unauthorized");
  }
};

app.use(authenticate);

app.use("/", router);

exports.app = functions.https.onRequest(app);
