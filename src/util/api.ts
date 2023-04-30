import axios from "axios";
import { ITokenCoingecko } from "../type/token";

export const getTokens = async () => {
  const res = await axios.get("https://api.mochi.pod.town/api/v1/defi/tokens");
  return res.data;
};

export const getTokenDetail = async (coingeckoId: string) => {
  const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins/${coingeckoId}`);
  return req.data.data as ITokenCoingecko;
};
