export interface IToken {
  id: number;
  address: string;
  symbol: string;
  chain_id: number;
  decimal: number;
  discord_bot_supported: boolean;
  coin_gecko_id: string;
  name: string;
  guild_default: boolean;
  is_native: boolean;
  is_favorite?: boolean;
}

export interface IQueryToken {
  id: string;
  symbol: string;
  name: string;
  is_favorite?: boolean;
}

type CoinTicker = {
  base: string;
  target: string;
  last: number;
  coin_id: string;
  target_coin_id: string;
};

export interface ITokenCoingecko {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  asset_platform_id: number;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    price_change_percentage_1h_in_currency: Record<string, number>;
    price_change_percentage_24h_in_currency: Record<string, number>;
    price_change_percentage_7d_in_currency: Record<string, number>;
  };
  tickers: CoinTicker[];
  description: Record<string, string>;
}

export type IPortfolio = Record<string, ITokenPortfolio>;

export interface ITokenPortfolio {
  tokenName: string;
  amount: number;
  coingeckoId: string;
  symbol: string;
}
