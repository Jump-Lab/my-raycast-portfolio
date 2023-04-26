import { List } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { ITokenCoingecko, ITokenPortfolio } from "../type/token";

const PortfolioItem = (props: ITokenPortfolio) => {
  const { coingeckoId, amount, tokenName, symbol } = props;
  const [tokenDetail, setTokenDetail] = useState<ITokenCoingecko>();

  const getTokenInformation = async (tokenId: string) => {
    const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins/${tokenId}`);
    return req.data;
  };
  useEffect(() => {
    if (coingeckoId) {
      getTokenInformation(coingeckoId).then((d) => {
        setTokenDetail(d.data);
      });
    }
  }, [coingeckoId]);

  return (
    <List.Item
      title={tokenName}
      subtitle={symbol}
      accessories={[
        {
          text: `${amount} ${symbol} ~ ${
            tokenDetail?.market_data?.current_price?.usd ? tokenDetail?.market_data?.current_price?.usd * amount : ""
          } USD`,
        },
      ]}
    />
  );
};

export default PortfolioItem;
