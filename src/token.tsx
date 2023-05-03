import { Action, ActionPanel, List, LocalStorage, useNavigation } from "@raycast/api";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import PortfolioInput from "./components/PortfolioInput";
import TokenDetail from "./components/TokenDetail";
import { IToken, ITokenCoingecko } from "./type/token";
import { getTokens } from "./utils/mochiApi";
import { isTextIncludes } from "./utils/string";

export default function Command() {
  const { push } = useNavigation();
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [tokenData, setTokenData] = useState<ITokenCoingecko>();
  const [isLoading, setIsLoading] = useState(false);

  const [searchTokenText, setSearchTokenText] = useState("");

  const [filteredList, filterList] = useState<IToken[]>([]);

  useEffect(() => {
    filterList(
      tokens.filter(
        (token) => isTextIncludes(token.name, searchTokenText) || isTextIncludes(token.symbol, searchTokenText)
      )
    );
  }, [searchTokenText, tokens]);

  const addTokenToFavorite = async (coingecko_id: string) => {
    const favorite = await LocalStorage.getItem("favoritesCoin");
    const listFavorite = favorite?.toString().split(",") || [];
    listFavorite.push(coingecko_id);
    await LocalStorage.setItem("favoritesCoin", listFavorite.join(","));
    await getListTokens();
  };

  const removeTokenFromFavorite = async (coingecko_id: string) => {
    const favorite = await LocalStorage.getItem("favoritesCoin");
    const listFavorite = favorite?.toString().split(",") || [];
    await LocalStorage.setItem("favoritesCoin", listFavorite.filter((id) => id !== coingecko_id).join(","));
    await getListTokens();
  };

  const getListTokens = useCallback(async () => {
    let listTokens = [];
    if (tokens.length > 0) {
      listTokens = [...tokens];
    } else {
      const req = await getTokens();
      listTokens = req.data.data as IToken[];
    }
    const favorite = await LocalStorage.getItem("favoritesCoin");
    if (favorite) {
      const listFavorite = favorite.toString().split(",");
      const newListTokens = listTokens.map((token) => ({
        ...token,
        is_favorite: listFavorite.includes(token.coin_gecko_id),
      }));
      setTokens(newListTokens);
    } else setTokens(listTokens);
  }, [tokens]);

  useEffect(() => {
    getListTokens();
  }, []);

  return (
    <List
      isLoading={isLoading}
      filtering={false}
      onSearchTextChange={setSearchTokenText}
      navigationTitle="Search Tokens"
      searchBarPlaceholder="Search your favorite Tokens"
    >
      {filteredList.map((item) => (
        <List.Item
          key={item.address}
          title={item.name}
          subtitle={item.symbol}
          accessories={[
            {
              text: item.is_favorite ? "⭐️" : "",
            },
          ]}
          actions={
            <ActionPanel>
              <Action
                title="Check Detail"
                onAction={async () => {
                  const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins/${item.coin_gecko_id}`);
                  push(<TokenDetail data={req.data.data} />);
                }}
              />
              <Action
                title="Enter Portfolio"
                onAction={() => {
                  push(
                    <PortfolioInput tokenName={item.name} tokenSymbol={item.symbol} coingeckoId={item.coin_gecko_id} />
                  );
                }}
              />
              <Action.OpenInBrowser
                title="Check on Coingecko"
                url={`https://www.coingecko.com/en/coins/${item.coin_gecko_id}`}
              />
              {item.is_favorite ? (
                <Action title="Remove Favorite" onAction={async () => removeTokenFromFavorite(item.coin_gecko_id)} />
              ) : (
                <Action title="Add Favorite" onAction={async () => addTokenToFavorite(item.coin_gecko_id)} />
              )}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
