import { Color, Detail } from "@raycast/api";
import { ITokenCoingecko } from "../type/token";

type Props = {
  data: ITokenCoingecko;
};

const TokenDetail: React.FC<Props> = ({ data }) => {
  const MarkDown = `
  # ${data.name} - ${data.symbol}
  
  ![](${data?.image.large})
  
  ${data.description?.en || ""}
  `;
  const priceChange1HUSD = data.market_data.price_change_percentage_1h_in_currency.usd;
  const priceChange24HUSD = data.market_data.price_change_percentage_24h_in_currency.usd;

  const priceChange7DUSD = data.market_data.price_change_percentage_7d_in_currency.usd;

  return (
    <Detail
      markdown={MarkDown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Price (USD)" text={data.market_data.current_price.usd.toLocaleString()} />
          <Detail.Metadata.Label title="Market Cap" text={data.market_data.market_cap.usd.toLocaleString()} />
          <Detail.Metadata.TagList title="Rank">
            <Detail.Metadata.TagList.Item text={data.market_cap_rank.toString()} color={"#eed535"} />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Change (1h)"
            text={{
              value: priceChange1HUSD.toLocaleString(),
              color: priceChange1HUSD < 0 ? Color.Red : priceChange1HUSD > 0 ? Color.Green : Color.PrimaryText,
            }}
          />
          <Detail.Metadata.Label
            title="Change (24h)"
            text={{
              value: priceChange24HUSD.toLocaleString(),
              color: priceChange24HUSD < 0 ? Color.Red : priceChange1HUSD > 0 ? Color.Green : Color.PrimaryText,
            }}
          />
          <Detail.Metadata.Label
            title="Change (7d)"
            text={{
              value: priceChange7DUSD.toLocaleString(),
              color: priceChange7DUSD < 0 ? Color.Red : priceChange1HUSD > 0 ? Color.Green : Color.PrimaryText,
            }}
          />
        </Detail.Metadata>
      }
    />
  );
};

export default TokenDetail;
