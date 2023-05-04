import { useEffect, useState } from "react";
import { Action, ActionPanel, List } from "@raycast/api";
import axios from "axios";

import { ITokenCoingecko, ITokenPortfolio } from "../type/token";
import { formatUsdAmount } from "../utils/number";

const PortfolioItem = (
  props: ITokenPortfolio & {
    handleSetAmount: (val: number) => void;
    removePortfolioItem: (token: string) => void;
  }
) => {
  const { coingeckoId, amount, symbol, handleSetAmount, removePortfolioItem } = props;
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
      title={symbol}
      subtitle={`Amount: ${amount}`}
      accessories={[
        {
          text: formatUsdAmount(
            tokenDetail?.market_data?.current_price?.usd ? tokenDetail?.market_data?.current_price?.usd * amount : 0
          ),
          tooltip: `${amount} ${symbol}`,
        },
      ]}
      actions={
        <ActionPanel>
          <Action title="Remove from Portfolio" onAction={() => removePortfolioItem(symbol)} />
        </ActionPanel>
      }
    />
  );
};

export default PortfolioItem;
