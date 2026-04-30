import { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { saveToLeaderboard } from "../../services/scoreService";
import { ALL_TILES } from "../../constants/tiles";
import { MAX_TILE_VALUE, MIN_TILE_VALUE, MAX_RESHUFFLES } from "../../constants/gameConfig";
import Button from "../shared/Button";

// ─── GameOver Screen ──────────────────────────────────────────────────────────
// Reads gameOverReason + score from context — no props, no URL params.
// Saves the score to localStorage exactly once on mount via a ref guard
// (useRef prevents double-firing in React StrictMode dev double-invoke).

// Per-reason copy and styling
const OUTCOME_CONFIG = {
  won: {
    title:      "You Won!",
    titleClass: "text-success",
    icon:       "▲",
    iconClass:  "bg-[#f0fdf4] text-success border-success",
  },
  lost: {
    title:      "You Lost.",
    titleClass: "text-error",
    icon:       "▼",
    iconClass:  "bg-[#fef2f2] text-error border-error",
  },
  reshuffles: {
    title:      "Game Over",
    titleClass: "text-primary",
    icon:       "—",
    iconClass:  "bg-background text-secondary border-border",
  },
};

// Finds the Dragon/Wind tile whose value crossed a threshold this game.
// Returns null for the 'reshuffles' reason since no tile value was the trigger.
const findTriggerTile = (gameOverReason, tileValues) => {
  if (gameOverReason === "reshuffles") return null;

  const entry = Object.entries(tileValues).find(([, val]) =>
    gameOverReason === "won"  ? val >= MAX_TILE_VALUE :
    gameOverReason === "lost" ? val <= MIN_TILE_VALUE : false
  );
  if (!entry) return null;
  return ALL_TILES.find((t) => t.id === entry[0]) ?? null;
};

const GameOver = () => {
  const navigate            = useNavigate();
  const { state, dispatch } = useGame();
  const { score, gameOverReason, tileValues } = state;

  // Guard: if someone navigates directly to /gameover with no active game
  useEffect(() => {
    if (!gameOverReason) navigate("/");
  }, [gameOverReason, navigate]);

  // Save score to leaderboard exactly once — the ref prevents re-saving if
  // React StrictMode double-invokes this effect in development
  const hasSaved = useRef(false);
  useEffect(() => {
    if (gameOverReason && !hasSaved.current) {
      saveToLeaderboard(score);
      hasSaved.current = true;
    }
  }, [score, gameOverReason]);

  // Find the specific tile that triggered the value-based game over
  const triggerTile = useMemo(
    () => findTriggerTile(gameOverReason, tileValues),
    // Intentionally stable — gameOverReason and tileValues don't change on this screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePlayAgain = () => {
    dispatch({ type: "START_GAME" });
    navigate("/game");
  };

  const handleHome = () => {
    dispatch({ type: "RESET_GAME" });
    navigate("/");
  };

  const config = OUTCOME_CONFIG[gameOverReason] ?? OUTCOME_CONFIG.reshuffles;

  // Build the subtitle from the specific trigger where available
  const subtitle = (() => {
    if (gameOverReason === "won") {
      return triggerTile
        ? `${triggerTile.name} reached ${MAX_TILE_VALUE}. Remarkable!`
        : `A tile value reached ${MAX_TILE_VALUE}. Remarkable!`;
    }
    if (gameOverReason === "lost") {
      return triggerTile
        ? `${triggerTile.name} hit ${MIN_TILE_VALUE}. Better luck next time.`
        : `A tile value hit ${MIN_TILE_VALUE}. Better luck next time.`;
    }
    return `The draw pile ran out ${MAX_RESHUFFLES} times.`;
  })();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm text-center animate-fade-up">

        {/* Outcome icon */}
        <div
          className={`w-20 h-20 rounded-full border-2 flex items-center justify-center text-3xl font-bold ${config.iconClass}`}
          aria-hidden="true"
        >
          {config.icon}
        </div>

        {/* Outcome title + subtitle */}
        <div className="flex flex-col gap-2">
          <h1 className={`text-4xl font-bold ${config.titleClass}`}>
            {config.title}
          </h1>
          <p className="text-secondary text-sm leading-relaxed">{subtitle}</p>
        </div>

        {/* Final score */}
        <div className="flex flex-col items-center gap-1 px-10 py-6 bg-surface border border-border rounded-[8px] w-full shadow-sm">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
            Final Score
          </span>
          <span className="text-7xl font-bold text-primary tabular-nums leading-none">
            {score}
          </span>
          <span className="text-sm text-secondary">points</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <Button variant="primary" size="lg" className="w-full" onClick={handlePlayAgain}>
            Play Again
          </Button>
          <Button variant="secondary" size="md" className="w-full" onClick={handleHome}>
            Back to Home
          </Button>
        </div>

      </div>
    </div>
  );
};

export default GameOver;
