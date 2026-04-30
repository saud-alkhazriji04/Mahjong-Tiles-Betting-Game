import { BASE_SPECIAL_TILE_VALUE } from "./gameConfig";

// ─── Tile Type Constants ──────────────────────────────────────────────────────
export const TILE_TYPE = {
  NUMBER: "number",
  DRAGON: "dragon",
  WIND:   "wind",
};

// ─── Suit Constants ───────────────────────────────────────────────────────────
export const SUIT = {
  CHARACTERS: "characters",
  BAMBOO:     "bamboo",
  CIRCLES:    "circles",
};

// ─── Tile Definitions ─────────────────────────────────────────────────────────
// Each entry represents one tile *type* (not one physical tile).
// The deck builder in deckService will create TILES_PER_TYPE copies of each.
//
// Mahjong Unicode block (U+1F000–U+1F021):
//   Winds:      🀀 🀁 🀂 🀃  (East, South, West, North)
//   Dragons:    🀄 🀅 🀆      (Red/Chun, Green/Hatsu, White/Haku)
//   Characters: 🀇–🀏         (1–9 Man)
//   Bamboo:     🀐–🀘         (1–9 Sou)
//   Circles:    🀙–🀡         (1–9 Pin)

// ── Wind Tiles ────────────────────────────────────────────────────────────────
export const WIND_TILES = [
  { id: "east-wind",  name: "East Wind",  type: TILE_TYPE.WIND, suit: null, emoji: "🀀", baseValue: BASE_SPECIAL_TILE_VALUE },
  { id: "south-wind", name: "South Wind", type: TILE_TYPE.WIND, suit: null, emoji: "🀁", baseValue: BASE_SPECIAL_TILE_VALUE },
  { id: "west-wind",  name: "West Wind",  type: TILE_TYPE.WIND, suit: null, emoji: "🀂", baseValue: BASE_SPECIAL_TILE_VALUE },
  { id: "north-wind", name: "North Wind", type: TILE_TYPE.WIND, suit: null, emoji: "🀃", baseValue: BASE_SPECIAL_TILE_VALUE },
];

// ── Dragon Tiles ──────────────────────────────────────────────────────────────
export const DRAGON_TILES = [
  { id: "red-dragon",   name: "Red Dragon",   type: TILE_TYPE.DRAGON, suit: null, emoji: "🀄", baseValue: BASE_SPECIAL_TILE_VALUE },
  { id: "green-dragon", name: "Green Dragon", type: TILE_TYPE.DRAGON, suit: null, emoji: "🀅", baseValue: BASE_SPECIAL_TILE_VALUE },
  { id: "white-dragon", name: "White Dragon", type: TILE_TYPE.DRAGON, suit: null, emoji: "🀆", baseValue: BASE_SPECIAL_TILE_VALUE },
];

// ── Number Tiles (Characters / Man) ───────────────────────────────────────────
const CHARACTER_EMOJIS = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"];
export const CHARACTER_TILES = CHARACTER_EMOJIS.map((emoji, i) => ({
  id:        `${i + 1}-characters`,
  name:      `${i + 1} Characters`,
  type:      TILE_TYPE.NUMBER,
  suit:      SUIT.CHARACTERS,
  emoji,
  baseValue: i + 1,
}));

// ── Number Tiles (Bamboo / Sou) ───────────────────────────────────────────────
const BAMBOO_EMOJIS = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"];
export const BAMBOO_TILES = BAMBOO_EMOJIS.map((emoji, i) => ({
  id:        `${i + 1}-bamboo`,
  name:      `${i + 1} Bamboo`,
  type:      TILE_TYPE.NUMBER,
  suit:      SUIT.BAMBOO,
  emoji,
  baseValue: i + 1,
}));

// ── Number Tiles (Circles / Pin) ──────────────────────────────────────────────
const CIRCLE_EMOJIS = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];
export const CIRCLE_TILES = CIRCLE_EMOJIS.map((emoji, i) => ({
  id:        `${i + 1}-circles`,
  name:      `${i + 1} Circles`,
  type:      TILE_TYPE.NUMBER,
  suit:      SUIT.CIRCLES,
  emoji,
  baseValue: i + 1,
}));

// ─── Master Tile List ─────────────────────────────────────────────────────────
// Single source of truth — every tile type in the game.
// Import this wherever you need the full catalogue.
export const ALL_TILES = [
  ...WIND_TILES,
  ...DRAGON_TILES,
  ...CHARACTER_TILES,
  ...BAMBOO_TILES,
  ...CIRCLE_TILES,
];

// ─── Initial Tile Values ──────────────────────────────────────────────────────
// Derived map of { [tileId]: baseValue } used as the starting tileValues in state.
// Number tiles never change value (their base IS their value), but they're
// included so tileService can treat all tiles uniformly.
export const INITIAL_TILE_VALUES = ALL_TILES.reduce((acc, tile) => {
  acc[tile.id] = tile.baseValue;
  return acc;
}, {});
