import axios from "axios";

const metadataBaseURI =
  "https://us-central1-goldfinch-frontends-prod.cloudfunctions.net/poolTokenMetadata";

const ranks = {
  "Pool Name": 99,
  "Borrower Name": 98,
  "USDC Interest Rate": 97,
  "Backer Position Principal": 96,
  "Last Updated At": 0,
};

export const extend = async (_chainId, metadata) => {
  const response = await axios.get(`${metadataBaseURI}/${metadata.tokenId}`);
  const attributes = response.data.attributes.map((a) => ({
    key: a.trait_type ?? "property",
    value: a.value,
    kind: "string",
    rank: ranks[a.trait_type] !== undefined ? ranks[a.trait_type] : 1,
  }));
  return {
    ...metadata,
    attributes,
    imageUrl: response.data.image,
  };
};
