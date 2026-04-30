// ─── Game Configuration ───────────────────────────────────────────────────────
// All tuneable constants live here so rules can be changed without touching logic.

/** Number of tiles dealt to the player each hand */
export const TILES_PER_HAND = 3;

/** How many copies of each tile type exist in a fresh deck (standard mahjong = 4) */
export const TILES_PER_TYPE = 4;

/** Maximum number of deck reshuffles before the game ends */
export const MAX_RESHUFFLES = 3;

/** A tile type reaching this value triggers a "You Won!" game over */
export const MAX_TILE_VALUE = 10;

/** A tile type reaching this value triggers a "You Lost!" game over */
export const MIN_TILE_VALUE = 0;

/** Starting value for Dragon and Wind tiles */
export const BASE_SPECIAL_TILE_VALUE = 5;

/** How much a Dragon/Wind tile type's value changes per win or loss */
export const SPECIAL_TILE_VALUE_DELTA = 1;

/** Number of top scores kept on the leaderboard */
export const LEADERBOARD_SIZE = 5;

/** localStorage key for the leaderboard */
export const LEADERBOARD_STORAGE_KEY = "penny_leaderboard";

/** Score awarded per correct bet */
export const SCORE_WIN = 1;

/** Score deducted per incorrect bet (set to 0 if losses should not penalise) */
export const SCORE_LOSS = 0;
