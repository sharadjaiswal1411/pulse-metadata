const { BigNumber } = require("@ethersproject/bignumber");
const { id } = require("@ethersproject/hash");
const { lootRarity, rarityDescription } = require("loot-rarity");

let items = {};

items.WEAPON = [
  "Warhammer",
  "Quarterstaff",
  "Maul",
  "Mace",
  "Club",
  "Katana",
  "Falchion",
  "Scimitar",
  "Long Sword",
  "Short Sword",
  "Ghost Wand",
  "Grave Wand",
  "Bone Wand",
  "Wand",
  "Grimoire",
  "Chronicle",
  "Tome",
  "Book",
];

items.CHEST = [
  "Divine Robe",
  "Silk Robe",
  "Linen Robe",
  "Robe",
  "Shirt",
  "Demon Husk",
  "Dragonskin Armor",
  "Studded Leather Armor",
  "Hard Leather Armor",
  "Leather Armor",
  "Holy Chestplate",
  "Ornate Chestplate",
  "Plate Mail",
  "Chain Mail",
  "Ring Mail",
];

items.HEAD = [
  "Ancient Helm",
  "Ornate Helm",
  "Great Helm",
  "Full Helm",
  "Helm",
  "Demon Crown",
  "Dragon's Crown",
  "War Cap",
  "Leather Cap",
  "Cap",
  "Crown",
  "Divine Hood",
  "Silk Hood",
  "Linen Hood",
  "Hood",
];

items.WAIST = [
  "Ornate Belt",
  "War Belt",
  "Plated Belt",
  "Mesh Belt",
  "Heavy Belt",
  "Demonhide Belt",
  "Dragonskin Belt",
  "Studded Leather Belt",
  "Hard Leather Belt",
  "Leather Belt",
  "Brightsilk Sash",
  "Silk Sash",
  "Wool Sash",
  "Linen Sash",
  "Sash",
];

items.FOOT = [
  "Holy Greaves",
  "Ornate Greaves",
  "Greaves",
  "Chain Boots",
  "Heavy Boots",
  "Demonhide Boots",
  "Dragonskin Boots",
  "Studded Leather Boots",
  "Hard Leather Boots",
  "Leather Boots",
  "Divine Slippers",
  "Silk Slippers",
  "Wool Shoes",
  "Linen Shoes",
  "Shoes",
];

items.HAND = [
  "Holy Gauntlets",
  "Ornate Gauntlets",
  "Gauntlets",
  "Chain Gloves",
  "Heavy Gloves",
  "Demon's Hands",
  "Dragonskin Gloves",
  "Studded Leather Gloves",
  "Hard Leather Gloves",
  "Leather Gloves",
  "Divine Gloves",
  "Silk Gloves",
  "Wool Gloves",
  "Linen Gloves",
  "Gloves",
];

items.NECK = ["Necklace", "Amulet", "Pendant"];

items.RING = ["Gold Ring", "Silver Ring", "Bronze Ring", "Platinum Ring", "Titanium Ring"];

const suffixes = [
  "of Power",
  "of Giants",
  "of Titans",
  "of Skill",
  "of Perfection",
  "of Brilliance",
  "of Enlightenment",
  "of Protection",
  "of Anger",
  "of Rage",
  "of Fury",
  "of Vitriol",
  "of the Fox",
  "of Detection",
  "of Reflection",
  "of the Twins",
];

const namePrefixes = [
  "Agony",
  "Apocalypse",
  "Armageddon",
  "Beast",
  "Behemoth",
  "Blight",
  "Blood",
  "Bramble",
  "Brimstone",
  "Brood",
  "Carrion",
  "Cataclysm",
  "Chimeric",
  "Corpse",
  "Corruption",
  "Damnation",
  "Death",
  "Demon",
  "Dire",
  "Dragon",
  "Dread",
  "Doom",
  "Dusk",
  "Eagle",
  "Empyrean",
  "Fate",
  "Foe",
  "Gale",
  "Ghoul",
  "Gloom",
  "Glyph",
  "Golem",
  "Grim",
  "Hate",
  "Havoc",
  "Honour",
  "Horror",
  "Hypnotic",
  "Kraken",
  "Loath",
  "Maelstrom",
  "Mind",
  "Miracle",
  "Morbid",
  "Oblivion",
  "Onslaught",
  "Pain",
  "Pandemonium",
  "Phoenix",
  "Plague",
  "Rage",
  "Rapture",
  "Rune",
  "Skull",
  "Sol",
  "Soul",
  "Sorrow",
  "Spirit",
  "Storm",
  "Tempest",
  "Torment",
  "Vengeance",
  "Victory",
  "Viper",
  "Vortex",
  "Woe",
  "Wrath",
  "Light's",
  "Shimmering",
];

const nameSuffixes = [
  "Bane",
  "Root",
  "Bite",
  "Song",
  "Roar",
  "Grasp",
  "Instrument",
  "Glow",
  "Bender",
  "Shadow",
  "Whisper",
  "Shout",
  "Growl",
  "Tear",
  "Peak",
  "Form",
  "Sun",
  "Moon",
];

const random = (input) => BigNumber.from(id(input));

const capitalize = (s) => s.charAt(0).toUpperCase() + s.toLowerCase().slice(1);

export const getTokenMetadata = (tokenId) => {
  let scores = {
    greatness: 0,
    orders: 0,
    names: 0,
    plusones: 0,
    divines: 0,
    demons: 0,
    dragons: 0,
  };

  const result = {
    contract: "0x79e2d470f950f2cf78eef41720e8ff2cf4b3cd78",
    tokenId,
    name: `Bag #${tokenId}`,
    imageUrl: `https://www.loot.exchange/api/image/${tokenId}`,
    attributes: [],
  };

  const bagItems = [];
  for (const keyPrefix in items) {
    const sourceArray = items[keyPrefix];
    const rand = random(keyPrefix + tokenId);

    let output = sourceArray[rand.mod(sourceArray.length).toNumber()];

    const greatness = rand.mod(21);
    scores.greatness += greatness.toNumber();

    result.attributes.push({
      key: `Item`,
      value: output,
    });

    if (greatness.gt(14)) {
      scores.orders++;

      const order = suffixes[rand.mod(suffixes.length).toNumber()];
      result.attributes.push({
        key: `${capitalize(keyPrefix)} Order`,
        value: order.slice(3),
      });

      output = output + " " + order;
    }

    if (greatness.gte(19)) {
      scores.names++;

      const name = [
        namePrefixes[rand.mod(namePrefixes.length).toNumber()],
        nameSuffixes[rand.mod(nameSuffixes.length).toNumber()],
      ];
      if (greatness.eq(19)) {
        output = '"' + name[0] + " " + name[1] + '" ' + output;
      } else {
        scores.plusones++;
        output = '"' + name[0] + " " + name[1] + '" ' + output + " +1";
      }
    }

    bagItems.push(output);

    if (output.toLowerCase().search("dragon") >= 0) {
      scores.dragons++;
    }
    if (output.toLowerCase().search("demon") >= 0) {
      scores.demons++;
    }
    if (output.toLowerCase().search("divine") >= 0) {
      scores.divines++;
    }
  }

  result.attributes.push({
    key: "Greatness",
    value: scores.greatness,
  });
  result.attributes.push({
    key: "Orders",
    value: scores.orders,
  });
  result.attributes.push({
    key: "Names",
    value: scores.names,
  });
  result.attributes.push({
    key: "Plus Ones",
    value: scores.plusones,
  });
  result.attributes.push({
    key: "Rarity",
    value: rarityDescription(lootRarity(bagItems.map((i) => i))),
  });
  result.attributes.push({
    key: `Dragons`,
    value: scores.dragons,
  });
  result.attributes.push({
    key: `Demons`,
    value: scores.demons,
  });
  result.attributes.push({
    key: `Divines`,
    value: scores.divines,
  });

  for (const attribute of result.attributes) {
    if (isNaN(attribute.value)) {
      attribute.kind = "string";
    } else {
      attribute.kind = "number";
    }
    attribute.rank = 1;
  }

  return result;
};

export const getAllTokensMetadata = () => {
  const metadata = [];
  for (let tokenId = 1; tokenId <= 7881; tokenId++) {
    metadata.push(getTokenMetadata(tokenId));
  }
  return metadata;
};
