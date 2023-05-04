import { Detail, List, LocalStorage } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";

import PortfolioItem from "./components/PortfolioItem";
import { LOCALSTORAGE_PORTFOLIO } from "./constant";
import { IPortfolio } from "./type/token";
import { getPortfolio } from "./utils/myPortoflioApi";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [portfolio, setPortfolio] = useState<IPortfolio>({});
  const [totalAmount, setTotalAmount] = useState(0);

  // fetch portfolio
  useEffect(() => {
    (async () => {
      try {
        const localStorageData = await LocalStorage.getItem(LOCALSTORAGE_PORTFOLIO);
        const localData = localStorageData?.toString ? JSON.parse(localStorageData.toString()) : {};
        setPortfolio(localData);

        const test = await getPortfolio();
        const { portfolio } = test;
        setPortfolio(portfolio);
        await LocalStorage.setItem(LOCALSTORAGE_PORTFOLIO, JSON.stringify(portfolio));
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSetAmount = useCallback(
    (val: number) => {
      setTotalAmount((prev) => prev + val);
    },
    [totalAmount]
  );

  if (isLoading) {
    return <Detail isLoading={isLoading} />;
  }

  return (
    <List searchBarAccessory={undefined} navigationTitle={`Total: ${totalAmount} $`}>
      {Object.keys(portfolio).map((i) => (
        <PortfolioItem key={portfolio[i].symbol} {...portfolio[i]} handleSetAmount={handleSetAmount} />
      ))}
    </List>
  );
};

export default Portfolio;
