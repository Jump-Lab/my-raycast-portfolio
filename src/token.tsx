import { Action, ActionPanel, Form, Icon, Toast, showToast, useNavigation } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";
import TokenDetail from "./components/TokenDetail";
import { IToken, ITokenCoingecko } from "./type/token";

export default function Command() {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [tokenData, setTokenData] = useState<ITokenCoingecko>();

  const getTokens = async () => {
    const res = await axios.get("https://api.mochi.pod.town/api/v1/defi/tokens");
    return res.data;
  };

  const getTokenInformation = async (tokenId: string) => {
    const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins/${tokenId}`);
    console.log(req.data);
    return req.data;
  };

  useEffect(() => {
    getTokens()
      .then((data) => {
        setTokens(data.data.data);
      })
      .catch(() => setTokens([]));
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <ShareSecretAction />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="token" title="Choose a token" storeValue>
        {tokens.map((token) => (
          <Form.Dropdown.Item key={token.address} value={token.coin_gecko_id} title={token.symbol} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

function ShareSecretAction() {
  const { push } = useNavigation();
  async function handleSubmit(values: { token: string }) {
    if (!values.token) {
      showToast({
        style: Toast.Style.Failure,
        title: "Secret is required",
      });
      return;
    }
    const req = await axios.get(`https://api.mochi.pod.town/api/v1/defi/coins/${values.token}`);
    push(<TokenDetail data={req.data.data} />);
  }

  return <Action.SubmitForm icon={Icon.Upload} title="Get Token Information" onSubmit={handleSubmit} />;
}
