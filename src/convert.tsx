// IN DEVELOPMENT
import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import ConvertInput from "./components/ConvertInput";
import { IToken } from "./type/token";
import { getTokens } from "./utils/mochiApi";

const Convert = () => {
  const { push } = useNavigation();

  const [tokens, setTokens] = useState<IToken[]>([]);

  const [selectedTargetToken, setSelectedTargetToken] = useState<IToken>();
  const [selectedSwapToken, setSelectedSwapToken] = useState<IToken>();

  const getListTokens = async () => {
    const data = await getTokens();
    setTokens(data.data.data);
  };

  const handleSubmitForm = useCallback(() => {
    if (selectedSwapToken && selectedTargetToken) {
      push(<ConvertInput target={selectedTargetToken} swap={selectedSwapToken} />);
    }
  }, [selectedSwapToken, selectedTargetToken]);

  const reverseSwap = useCallback(() => {
    const prevTarget = selectedSwapToken;
    const prevSwap = selectedSwapToken;
    setSelectedTargetToken(prevSwap);
    setSelectedSwapToken(prevTarget);
  }, [selectedTargetToken, selectedSwapToken]);

  useEffect(() => {
    getListTokens();
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={() => handleSubmitForm()} />
          <Action title="Reverse Swap" onAction={reverseSwap} />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        onChange={(e) => {
          setSelectedTargetToken(tokens.find((token) => token.coin_gecko_id === e));
        }}
        title="Target Token"
        id="target_token"
        defaultValue={tokens[0]?.coin_gecko_id || ""}
        value={selectedTargetToken?.coin_gecko_id}
      >
        {tokens
          .filter((token) => token.coin_gecko_id !== selectedSwapToken?.coin_gecko_id)
          .map((token, index) => (
            <Form.Dropdown.Item
              key={`target-${index}`}
              value={token.coin_gecko_id}
              title={`${token.name}-${token.symbol}`}
            />
          ))}
      </Form.Dropdown>
      <Form.Dropdown
        title="Swap Token"
        id="swap_token"
        onChange={(e) => {
          setSelectedSwapToken(tokens.find((token) => token.coin_gecko_id === e));
        }}
        defaultValue={tokens[1]?.coin_gecko_id || ""}
        value={selectedSwapToken?.coin_gecko_id}
      >
        {tokens
          .filter((token) => token.coin_gecko_id !== selectedTargetToken?.coin_gecko_id)
          .map((token, index) => (
            <Form.Dropdown.Item
              key={`swap-${index}`}
              value={token.coin_gecko_id}
              title={`${token.name}-${token.symbol}`}
            />
          ))}
      </Form.Dropdown>
    </Form>
  );
};

export default Convert;
