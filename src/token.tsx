import { Action, ActionPanel, List, LocalStorage, useNavigation } from "@raycast/api";
import axios from "axios";
import { useCallback, useState } from "react";
import PortfolioInput from "./components/PortfolioInput";
import TokenDetail from "./components/TokenDetail";
import { IQueryToken } from "./type/token";

export default function Command() {
  const { push } = useNavigation();
  const [tokens, setTokens] = useState<IQueryToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTokenToFavorite = useCallback(
    async (coingecko_id: string) => {
      const favorite = await LocalStorage.getItem("favoritesCoin");
      const listFavorite = favorite?.toString().split(",") || [];
      listFavorite.push(coingecko_id);
      await LocalStorage.setItem("favoritesCoin", listFavorite.join(","));
      setTokens(
        tokens.map((token) => ({
          ...token,
          is_favorite: token.id === coingecko_id ? true : token.is_favorite,
        }))
      );
    },
    [tokens]
  );

  const removeTokenFromFavorite = useCallback(
    async (coingecko_id: string) => {
      const favorite = await LocalStorage.getItem("favoritesCoin");
      const listFavorite = favorite?.toString().split(",") || [];
      await LocalStorage.setItem("favoritesCoin", listFavorite.filter((id) => id !== coingecko_id).join(","));

      setTokens(
        tokens.map((token) => ({
          ...token,
          is_favorite: token.id === coingecko_id ? false : token.is_favorite,
        }))
      );
    },
    [tokens]
  );

  const handleSearchToken = async (query: string) => {
    if (query === "") {
      setTokens([]);
      return;
    }

    setIsLoading(true);
    try {
      const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins?query=${query}`);
      const listTokens: IQueryToken[] = req.data.data;
      const favorite = await LocalStorage.getItem("favoritesCoin");
      if (favorite) {
        const listFavorite = favorite.toString().split(",");
        const newListTokens = listTokens.map((token) => ({
          ...token,
          is_favorite: listFavorite.includes(token.id),
        }));
        setTokens(newListTokens);
      } else setTokens(listTokens);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <List
      isLoading={isLoading}
      filtering={false}
      onSearchTextChange={handleSearchToken}
      navigationTitle="Search Tokens"
      searchBarPlaceholder="Search your favorite Tokens"
      throttle={true}
    >
      {tokens.map((item) => (
        <List.Item
          key={item.id}
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
                title="View Detail"
                onAction={async () => {
                  const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins/${item.id}`);
                  push(<TokenDetail data={req.data.data} />);
                }}
              />
              <Action
                title="Add to My Portfolio"
                onAction={() => {
                  push(<PortfolioInput tokenName={item.name} tokenSymbol={item.symbol} coingeckoId={item.id} />);
                }}
              />
              {/* <Action.OpenInBrowser
                title="Check on Coingecko"
                url={`https://www.coingecko.com/en/coins/${item.coin_gecko_id}`}
              /> */}
              {item.is_favorite ? (
                <Action title={`Remove Favorite ${item.id}`} onAction={async () => removeTokenFromFavorite(item.id)} />
              ) : (
                <Action title="Add Favorite" onAction={async () => addTokenToFavorite(item.id)} />
              )}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
