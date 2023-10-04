import _ from "lodash";

import { customHandleCollection, hasCustomCollectionHandler } from "../../../../../src/custom";

import { extendCollectionMetadata } from "../../../../../src/extend";

import * as opensea from "../../../../../src/fetchers/opensea";
import * as rarible from "../../../../../src/fetchers/rarible";
import * as simplehash from "../../../../../src/fetchers/simplehash";
import * as centerdev from "../../../../../src/fetchers/centerdev";
import * as soundxyz from "../../../../../src/fetchers/soundxyz";
import * as onchain from "../../../../../src/fetchers/onchain";
import * as manifold from "../../../../../src/fetchers/manifold";
import { supportedNetworks } from "../../../../../src/shared/utils";

const api = async (req, res) => {
  try {
    // Validate network and detect chain id
    const network = req.query.network;

    console.log("supportedNetworkssupportedNetworkssupportedNetworks",supportedNetworks,network);
    
    if (!(network in supportedNetworks)) {
      throw new Error("Unknown network");
    }

    const chainId = supportedNetworks[network];

    // Validate indexing method and set up provider
    const method = req.query.method;
    if (
      ![
        "opensea",
        "rarible",
        "simplehash",
        "centerdev",
        "soundxyz",
        "onchain",
        "manifold",
      ].includes(method)
    ) {
      throw new Error("Unknown method");
    }

    let provider = opensea;
    if (method === "rarible") {
      provider = rarible;
    } else if (method === "simplehash") {
      provider = simplehash;
    } else if (method === "centerdev") {
      provider = centerdev;
    } else if (method === "soundxyz") {
      provider = soundxyz;
    } else if (method === "onchain") {
      provider = onchain;
    } else if (method === "manifold") {
      provider = manifold;
    }

    const token = req.query.token?.toLowerCase();
    if (!token) {
      throw new Error("Missing token");
    }

    const [contract, tokenId] = token.split(":");
    if (!contract) {
      throw new Error(`Unknown contract ${contract}`);
    }

    if (!tokenId) {
      throw new Error(`Unknown tokenId ${tokenId}`);
    }

    let collection = null;

    if (hasCustomCollectionHandler(chainId, contract)) {
      collection = await customHandleCollection(chainId, { contract, tokenId });
    } else {
      collection = await provider.fetchCollection(chainId, {
        contract,
        tokenId,
      });
    }

    if (!collection || _.isEmpty(collection)) {
      throw new Error("No collection found");
    }

    return res.status(200).json({
      collection: await extendCollectionMetadata(chainId, collection, tokenId),
    });
  } catch (error) {
    return res.status(500).json({ error: `Internal error: ${error}` });
  }
};

export default api;
