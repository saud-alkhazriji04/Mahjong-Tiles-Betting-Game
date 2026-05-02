import { ALL_TILES } from "../constants/tiles";
import { TILES_PER_TYPE } from "../constants/gameConfig";

// ─── Deck Service ─────────────────────────────────────────────────────────────
// Responsible for creating, shuffling, drawing from, and reshuffling the deck.
// All functions are pure — they never mutate their inputs.

/**
 * Fisher-Yates shuffle. Returns a new shuffled array.
 * @param {Object[]} deck
 * @returns {Object[]}
 */
export const shuffleDeck = (deck) => {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Builds a full unshuffled deck: TILES_PER_TYPE physical copies of every tile type.
 * Each copy gets a unique `instanceId` so React keys and discard tracking work
 * correctly when multiple copies of the same tile type are on screen at once.
 * @returns {Object[]}
 */
export const createDeck = () =>
  ALL_TILES.flatMap((tile) =>
    Array.from({ length: TILES_PER_TYPE }, (_, copyIndex) => ({
      ...tile,
      instanceId: `${tile.id}-${copyIndex}`,
    })),
  );

/**
 * Draws `count` tiles from the top of the deck.
 * @param {Object[]} deck
 * @param {number}   count
 * @returns {{ drawn: Object[], remaining: Object[] }}
 */
export const drawTiles = (deck, count) => ({
  drawn: deck.slice(0, count),
  remaining: deck.slice(count),
});

/**
 * Reshuffles after the draw pile runs out.
 * Combines the discard pile with a brand-new deck, then shuffles.
 * The draw pile is empty at this point, so it is not included.
 * This causes the draw pile to keep growing it doesnt make sence
 * but this is what the assessment doc specified.
 * @param {Object[]} discardPile
 * @returns {Object[]} new draw pile
 */
export const reshuffleDeck = (discardPile) =>
  shuffleDeck([...discardPile, ...createDeck()]);
