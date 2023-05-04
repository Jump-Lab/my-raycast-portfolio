import { List } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { ITokenCoingecko, ITokenPortfolio } from "../type/token";

const PortfolioItem = (
  props: ITokenPortfolio & {
    handleSetAmount: (val: number) => void;
  }
) => {
  const { coingeckoId, amount, tokenName, symbol, handleSetAmount } = props;
  const [tokenDetail, setTokenDetail] = useState<ITokenCoingecko>();

  const getTokenInformation = async (tokenId: string) => {
    const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins/${tokenId}`);
    return req.data;
  };
  useEffect(() => {
    if (coingeckoId) {
      getTokenInformation(coingeckoId).then((d) => {
        const data = d.data as ITokenCoingecko;
        setTokenDetail(data);
        handleSetAmount(data.market_data.current_price.usd * amount);
      });
    }
  }, [coingeckoId]);

  return (
    <List.Item
      title={tokenName}
      subtitle={symbol}
      accessories={[
        {
          text: `${
            tokenDetail?.market_data?.current_price?.usd ? tokenDetail?.market_data?.current_price?.usd * amount : ""
          } $`,

          tooltip: `${amount} ${symbol}`,
        },
      ]}
    />
  );
};

export default PortfolioItem;
