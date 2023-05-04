import { Detail, List, LocalStorage } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";

import PortfolioItem from "./components/PortfolioItem";
import { LOCALSTORAGE_PORTFOLIO } from "./constant";
import { IPortfolio } from "./type/token";
import { getPortfolio, upsertPortfolio } from "./utils/myPortoflioApi";
import { formatUsdAmount } from "./utils/number";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [portfolio, setPortfolio] = useState<IPortfolio>({});
  const [totalAmount, setTotalAmount] = useState(0);

  const removePortfolioItem = async (tokenSymbol: string) => {
    try {
      setIsLoading(true)
      const newPortfolio = { ...portfolio };
      delete newPortfolio[tokenSymbol];
      setPortfolio(newPortfolio)
      setIsLoading(false);

      await upsertPortfolio(newPortfolio)
      await LocalStorage.setItem(LOCALSTORAGE_PORTFOLIO, JSON.stringify(newPortfolio));
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleSetAmount = useCallback(
    (val: number) => {
      setTotalAmount((prev) => prev + val);
    },
    [totalAmount]
  );

  // fetch portfolio
  useEffect(() => {
    (async () => {
      try {
        const localStorageData = await LocalStorage.getItem(LOCALSTORAGE_PORTFOLIO);
        const localData = localStorageData?.toString ? JSON.parse(localStorageData.toString()) : {};
        setPortfolio(localData);
        setIsLoading(false);

        const firebaseData = await getPortfolio();
        const { portfolio } = firebaseData;
        console.log("Log ~ portfolio:", portfolio);
        setPortfolio(portfolio);
        await LocalStorage.setItem(LOCALSTORAGE_PORTFOLIO, JSON.stringify(portfolio));
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <Detail isLoading={isLoading} />;
  }

  return (
    <List searchBarAccessory={undefined} navigationTitle={`Total: ${formatUsdAmount(totalAmount)}`}>
      {Object.keys(portfolio).map((i) => (
        <PortfolioItem key={portfolio[i].symbol} {...portfolio[i]} handleSetAmount={handleSetAmount} removePortfolioItem={removePortfolioItem} />
      ))}
    </List>
  );
};

export default Portfolio;
