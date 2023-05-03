import { ITokenPortfolio } from "../type/token";
import { request } from "./request";

export async function getPortfolio() {
  const portfolio = await request("/portfolio");
  return portfolio;
}

export async function upsertPortfolio(listTokens: Record<string, ITokenPortfolio>) {
  await request("/portfolio", "POST", listTokens);
}
