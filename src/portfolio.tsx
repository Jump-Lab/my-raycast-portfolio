import { List, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import PortfolioItem from "./components/PortfolioItem";
import { LOCALSTORAGE_PORTFOLIO } from "./constant";
import { IPortfolio } from "./type/token";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<IPortfolio>({});

  const getLocalStoragePortfolio = async () => {
    const req = await LocalStorage.getItem(LOCALSTORAGE_PORTFOLIO);
    return req?.toString ? JSON.parse(req.toString()) : {};
  };

  useEffect(() => {
    getLocalStoragePortfolio().then((d) => {
      setPortfolio(d);
    });
  }, []);

  return (
    <List>
      {Object.keys(portfolio).map((i) => (
        <PortfolioItem key={portfolio[i].symbol} {...portfolio[i]} />
      ))}
    </List>
  );
};

export default Portfolio;
