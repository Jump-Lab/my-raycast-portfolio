import { useEffect, useState } from "react";
import { List, Detail, LocalStorage, Toast, showToast } from "@raycast/api";

import PortfolioItem from "./components/PortfolioItem";
import * as google from "./oauth/google";
import { LOCALSTORAGE_PORTFOLIO } from "./constant";
import { IPortfolio } from "./type/token";
import { getPortfolio } from "./utils/myPortoflioApi";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [portfolio, setPortfolio] = useState<IPortfolio>({});

  // fetch portfolio
  useEffect(() => {
    (async () => {
      try {
        const localStorageData = await LocalStorage.getItem(LOCALSTORAGE_PORTFOLIO);
        const localData = localStorageData?.toString ? JSON.parse(localStorageData.toString()) : {};
        setPortfolio(localData);

        const test = await getPortfolio();
        const {portfolio} = test
        setPortfolio(portfolio);
        await LocalStorage.setItem(LOCALSTORAGE_PORTFOLIO, JSON.stringify(portfolio));
      } catch(e) {
        console.error(e);
      }
    })();
  }, []);

  if (isLoading) {
    return <Detail isLoading={isLoading} />;
  }

  return (
    <List isLoading={isLoading}>
      {Object.keys(portfolio).map((i) => (
        <PortfolioItem key={portfolio[i].symbol} {...portfolio[i]} />
      ))}
    </List>
  );
};

export default Portfolio;
