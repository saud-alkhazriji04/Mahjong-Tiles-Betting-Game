import { createDeck, shuffleDeck, drawTiles, reshuffleDeck } from "../services/deckService";
import { getHandTotal, updateTileValues, checkGameOverByValue } from "../services/tileService";
import { calculateScore } from "../services/scoreService";
import { INITIAL_TILE_VALUES } from "../constants/tiles";
import { TILES_PER_HAND, MAX_RESHUFFLES } from "../constants/gameConfig";

// ─── Initial State ────────────────────────────────────────────────────────────
// `resolvedHand` and `lastHandResult` are not in the spec's data shape but are
// required to support the RESOLVE_BET → [show result] → DRAW_HAND flow.
// `screen` is omitted — routing is handled by React Router, not state.
export const initialState = {
  drawPile:       [],
  discardPile:    [],
  currentHand:    [],
  resolvedHand:   [],         // drawn in RESOLVE_BET, shown as comparison; cleared by DRAW_HAND
  currentBet:     null,       // 'higher' | 'lower' | null
  lastHandResult: null,       // { result, oldTotal, newTotal } | null — drives result animation
  tileValues:     { ...INITIAL_TILE_VALUES },
  score:          0,
  reshuffleCount: 0,
  handHistory:    [],         // [{ tiles, total, bet, result }]
  isGameOver:     false,
  gameOverReason: null,       // 'won' | 'lost' | 'reshuffles' | null
};

// ─── Private Helper ───────────────────────────────────────────────────────────
// Attempts to draw `count` tiles. Reshuffles automatically if the draw pile is
// too small. Returns null if the reshuffle limit is already exhausted.
const drawWithReshuffle = (drawPile, discardPile, reshuffleCount, count) => {
  if (drawPile.length >= count) {
    const { drawn, remaining } = drawTiles(drawPile, count);
    return { drawn, drawPile: remaining, discardPile, reshuffleCount };
  }

  // Draw pile is too small — attempt a reshuffle
  if (reshuffleCount >= MAX_RESHUFFLES) {
    return { drawn: null, reason: "reshuffle_limit" };
  }

  const newDrawPile = reshuffleDeck(discardPile);
  const { drawn, remaining } = drawTiles(newDrawPile, count);
  return {
    drawn,
    drawPile:       remaining,
    discardPile:    [],          // discard was consumed into the fresh deck
    reshuffleCount: reshuffleCount + 1,
  };
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
// Heavy logic lives in services. The reducer's job is to orchestrate them and
// return the next state — it contains no business logic of its own.
const gameReducer = (state, action) => {
  switch (action.type) {

    // ── START_GAME ────────────────────────────────────────────────────────────
    // Resets everything, creates a fresh shuffled deck, deals the first hand.
    case "START_GAME": {
      const deck = shuffleDeck(createDeck());
      const { drawn, remaining } = drawTiles(deck, TILES_PER_HAND);
      return {
        ...initialState,
        tileValues:  { ...INITIAL_TILE_VALUES },
        drawPile:    remaining,
        currentHand: drawn,
      };
    }

    // ── DRAW_HAND ─────────────────────────────────────────────────────────────
    // Called by the Game component after the result animation finishes.
    // Transitions resolvedHand → currentHand and discards the old hand.
    // Does NOT draw new tiles — resolvedHand was already drawn in RESOLVE_BET.
    case "DRAW_HAND": {
      return {
        ...state,
        discardPile:    [...state.discardPile, ...state.currentHand],
        currentHand:    state.resolvedHand,
        resolvedHand:   [],
        lastHandResult: null,
      };
    }

    // ── PLACE_BET ─────────────────────────────────────────────────────────────
    // payload: 'higher' | 'lower'
    case "PLACE_BET": {
      return { ...state, currentBet: action.payload };
    }

    // ── RESOLVE_BET ───────────────────────────────────────────────────────────
    // Core action. Draws the comparison hand, determines win/loss, updates all
    // derived state. Does NOT transition the hand — DRAW_HAND does that after
    // the component has shown the result animation.
    case "RESOLVE_BET": {
      const {
        drawPile, discardPile, currentHand, currentBet,
        tileValues, score, reshuffleCount, handHistory,
      } = state;

      // 1. Draw comparison hand (reshuffle if needed)
      const drawResult = drawWithReshuffle(drawPile, discardPile, reshuffleCount, TILES_PER_HAND);
      if (!drawResult.drawn) {
        // drawResult.reason === 'reshuffle_limit' — neutral game over
        return { ...state, isGameOver: true, gameOverReason: "reshuffles" };
      }

      const { drawn: resolvedHand } = drawResult;

      // 2. Compare totals using pre-update tileValues so both hands are evaluated
      //    on the same value scale — no advantage from draw order
      const oldTotal = getHandTotal(currentHand, tileValues);
      const newTotal = getHandTotal(resolvedHand, tileValues);

      // Ties count as a loss (no explicit spec rule; easily changed here)
      const result =
        (currentBet === "higher" && newTotal > oldTotal) ||
        (currentBet === "lower"  && newTotal < oldTotal)
          ? "win"
          : "loss";

      // 3. Scale Dragon/Wind values based on the tiles in currentHand.
      //    The player can see currentHand before betting, making the scaling visible
      //    and strategically relevant. resolvedHand tiles are unknown at bet time.
      const newTileValues = updateTileValues(tileValues, currentHand, result);

      // 4. Check value-based game over (Dragon/Wind only, per spec)
      const { isOver, reason } = checkGameOverByValue(newTileValues);

      // 5. Update score and history
      const newScore   = calculateScore(score, result);
      const newHistory = [
        ...handHistory,
        { tiles: currentHand, total: oldTotal, bet: currentBet, result },
      ];

      const nextState = {
        ...state,
        drawPile:       drawResult.drawPile,
        discardPile:    drawResult.discardPile,
        reshuffleCount: drawResult.reshuffleCount,
        tileValues:     newTileValues,
        score:          newScore,
        handHistory:    newHistory,
        resolvedHand,
        currentBet:     null,
        lastHandResult: { result, oldTotal, newTotal },
      };

      if (isOver) {
        return { ...nextState, isGameOver: true, gameOverReason: reason };
      }

      return nextState;
    }

    // ── RESHUFFLE_DECK ────────────────────────────────────────────────────────
    // Manual reshuffle hook — available for future features (e.g. a player ability
    // to voluntarily reshuffle once per game at a score cost).
    // Automatic reshuffling during play is handled inside RESOLVE_BET.
    case "RESHUFFLE_DECK": {
      if (state.reshuffleCount >= MAX_RESHUFFLES) return state;
      return {
        ...state,
        drawPile:       reshuffleDeck(state.discardPile),
        discardPile:    [],
        reshuffleCount: state.reshuffleCount + 1,
      };
    }

    // ── END_GAME ──────────────────────────────────────────────────────────────
    // payload: 'won' | 'lost' | 'reshuffles'
    // Explicit override — for edge cases or future admin/debug controls.
    case "END_GAME": {
      return { ...state, isGameOver: true, gameOverReason: action.payload };
    }

    // ── RESET_GAME ────────────────────────────────────────────────────────────
    // Returns to a clean slate without starting a new game (used by Back to Home).
    case "RESET_GAME": {
      return { ...initialState, tileValues: { ...INITIAL_TILE_VALUES } };
    }

    default:
      return state;
  }
};

export default gameReducer;
