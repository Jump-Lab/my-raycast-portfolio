import { OAuth } from "@raycast/api";
import fetch from "node-fetch";

// Create an OAuth client ID via https://console.developers.google.com/apis/credentials
// As application type choose "iOS" (required for PKCE)
// As Bundle ID enter: com.raycast
const CLIENT_ID = "1005188031367-fktgo5fpngm620adthukckh6p5f4prda.apps.googleusercontent.com";

const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.AppURI,
  providerName: "Google",
  providerIcon: "google-logo.png",
  providerId: "google",
  description: "Connect your Google account\n(Raycast Extension Demo)",
});

// Authorization
export async function authorize(): Promise<string | undefined> {
  const tokenSet = await client.getTokens();
  if (tokenSet?.accessToken) {
    if (tokenSet.refreshToken && tokenSet.isExpired()) {
      await client.setTokens(await refreshTokens(tokenSet.refreshToken));
    }
    return tokenSet.idToken;
  }

  const authRequest = await client.authorizationRequest({
    endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  });
  const { authorizationCode } = await client.authorize(authRequest);
  const tokens = await fetchTokens(authRequest, authorizationCode);
  await client.setTokens(tokens);
  return tokens.id_token;
}

async function fetchTokens(authRequest: OAuth.AuthorizationRequest, authCode: string): Promise<OAuth.TokenResponse> {
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("code", authCode);
  params.append("verifier", authRequest.codeVerifier);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", authRequest.redirectURI);

  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: params });
  if (!response.ok) {
    console.error("fetch tokens error:", await response.text());
    throw new Error(response.statusText);
  }
  return (await response.json()) as OAuth.TokenResponse;
}

async function refreshTokens(refreshToken: string): Promise<OAuth.TokenResponse> {
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");

  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: params });
  if (!response.ok) {
    console.error("refresh tokens error:", await response.text());
    throw new Error(response.statusText);
  }
  const tokenResponse = (await response.json()) as OAuth.TokenResponse;
  tokenResponse.refresh_token = tokenResponse.refresh_token ?? refreshToken;
  return tokenResponse;
}
