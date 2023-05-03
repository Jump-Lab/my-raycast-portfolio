import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = "1005188031367-fktgo5fpngm620adthukckh6p5f4prda.apps.googleusercontent.com";
const ggClient = new OAuth2Client(CLIENT_ID);

export async function verify(token: string) {
  try {
    const ticket = await ggClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const user = ticket.getPayload();
    return user
  } catch (e) {
    console.error(e);
    throw new Error("Unauthorized")
  }
}
