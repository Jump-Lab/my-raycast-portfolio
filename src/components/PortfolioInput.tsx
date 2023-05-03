import { useState } from "react";
import { Action, ActionPanel, Form, LocalStorage, popToRoot } from "@raycast/api";

import { LOCALSTORAGE_PORTFOLIO } from "../constant";
import { ITokenPortfolio } from "../type/token";
import { upsertPortfolio } from "../utils/myPortoflioApi";

type Props = {
  tokenName: string;
  tokenSymbol: string;
  coingeckoId: string;
};

const PortfolioInput: React.FC<Props> = ({ tokenName, tokenSymbol, coingeckoId }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmitForm = async (amount: number) => {
    try {
      setLoading(true);
      const req = await LocalStorage.getItem(LOCALSTORAGE_PORTFOLIO);
      const listTokens: Record<string, ITokenPortfolio> = req ? JSON.parse(req.toString()) : {};

      listTokens[tokenSymbol] = {
        amount,
        coingeckoId,
        tokenName,
        symbol: tokenSymbol,
      };
      await upsertPortfolio(listTokens)
      await LocalStorage.setItem(LOCALSTORAGE_PORTFOLIO, JSON.stringify(listTokens));
      popToRoot();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Form
      isLoading={isLoading}
      navigationTitle={`${tokenName}-${tokenSymbol}`}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={(e) => handleSubmitForm(e.amount as number)} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="amount"
        title="Amount"
        placeholder="Enter Amount of your coin"
        value={inputValue}
        autoFocus={false}
        onChange={(e) => {
          const value = e.replace(/,/g, "");
          const isEndWithDot = value.endsWith(".");
          const isOnlyDot = value === ".";
          const valueToParse = isOnlyDot ? "0" : value;
          if (!/^\d*\.?\d*$/.test(value)) {
            return;
          } else {
            setInputValue(isEndWithDot ? Number(valueToParse) + "." : valueToParse);
          }
        }}
      />
    </Form>
  );
};

export default PortfolioInput;
