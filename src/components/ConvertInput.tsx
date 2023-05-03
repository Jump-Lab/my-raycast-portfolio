import { Form } from "@raycast/api";
import { useEffect, useState } from "react";
import { IToken } from "../type/token";
import { getTokenDetail } from "../utils/mochiApi";

type Props = {
  target: IToken;
  swap: IToken;
};

const ConvertInput: React.FC<Props> = ({ target, swap }) => {
  const [targetTokenPrice, setTargetTokenPrice] = useState(-1);
  const [swapTokenPrice, setSwapTokenPrice] = useState(-1);
  const [navTitle, setNavtitle] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const getSwapRate = async () => {
    try {
      setIsLoading(true);
      const targetToken = await getTokenDetail(target.coin_gecko_id);
      const swapToken = await getTokenDetail(swap.coin_gecko_id);
      const targetPrice = targetToken.market_data.current_price.usd;
      const swapPrice = swapToken.market_data.current_price.usd;
      setTargetTokenPrice(targetPrice);
      setSwapTokenPrice(swapPrice);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSwapRate();
  }, []);

  return (
    <Form isLoading={isLoading} navigationTitle={navTitle}>
      <Form.TextField
        title={target.name}
        id={swap.coin_gecko_id}
        onChange={(e) => {
          if (targetTokenPrice === -1 || swapTokenPrice === -1) return;
          const convertPirce = (Number(e) * (targetTokenPrice / swapTokenPrice)).toLocaleString("en-US", {
            maximumFractionDigits: 4,
          });
          setNavtitle(`${e} ${target.name} ~ ${convertPirce} ${swap.name}`);
        }}
      />
    </Form>
  );
};

export default ConvertInput;
