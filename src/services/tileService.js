import { ALL_TILES, TILE_TYPE } from "../constants/tiles";
import {
  SPECIAL_TILE_VALUE_DELTA,
  MAX_TILE_VALUE,
  MIN_TILE_VALUE,
} from "../constants/gameConfig";

// ─── Tile Service ─────────────────────────────────────────────────────────────
// Handles tile value logic, hand totals, and value-based game-over detection.
// All functions are pure — they never mutate their inputs.

/** Dragon and Wind tiles have dynamic values; number tiles are always their baseValue. */
const isSpecialTile = (tile) =>
  tile.type === TILE_TYPE.DRAGON || tile.type === TILE_TYPE.WIND;

/**
 * Returns the current effective value of a tile.
 * Number tiles always return baseValue. Dragon/Wind tiles look up the live value.
 * @param {Object} tile
 * @param {Object} tileValues  { [tileId]: number }
 * @returns {number}
 */
export const getTileValue = (tile, tileValues) => {
  if (!isSpecialTile(tile)) return tile.baseValue;
  return tileValues[tile.id];
};

/**
 * Sums the current values of all tiles in a hand.
 * @param {Object[]} hand
 * @param {Object}   tileValues
 * @returns {number}
 */
export const getHandTotal = (hand, tileValues) =>
  hand.reduce((sum, tile) => sum + getTileValue(tile, tileValues), 0);

/**
 * Updates tileValues after a hand result.
 * Only Dragon/Wind tiles that appear in the current hand are affected.
 * Win  → each Dragon/Wind type in the hand goes up by SPECIAL_TILE_VALUE_DELTA.
 * Loss → each Dragon/Wind type in the hand goes down by SPECIAL_TILE_VALUE_DELTA.
 *
 * Note: values are intentionally allowed to reach 0 or MAX_TILE_VALUE here.
 * The caller (reducer) checks checkGameOverByValue immediately after and ends
 * the game if a threshold is breached.
 *
 * @param {Object}          tileValues
 * @param {Object[]}        hand
 * @param {'win' | 'loss'}  result
 * @returns {Object} new tileValues (input is not mutated)
 */
export const updateTileValues = (tileValues, hand, result) => {
  const delta = result === "win" ? SPECIAL_TILE_VALUE_DELTA : -SPECIAL_TILE_VALUE_DELTA;
  const updated = { ...tileValues };

  hand.forEach((tile) => {
    if (isSpecialTile(tile)) {
      updated[tile.id] = updated[tile.id] + delta;
    }
  });

  return updated;
};

/**
 * Checks whether any Dragon or Wind tile value has reached a game-ending threshold.
 * Number tiles are excluded — their values never change.
 *
 * @param {Object} tileValues
 * @returns {{ isOver: boolean, reason: 'won' | 'lost' | null }}
 */
export const checkGameOverByValue = (tileValues) => {
  for (const tile of ALL_TILES) {
    if (!isSpecialTile(tile)) continue;

    const value = tileValues[tile.id];
    if (value >= MAX_TILE_VALUE) return { isOver: true, reason: "won" };
    if (value <= MIN_TILE_VALUE) return { isOver: true, reason: "lost" };
  }
  return { isOver: false, reason: null };
};
