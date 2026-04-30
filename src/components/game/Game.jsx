import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { getHandTotal } from "../../services/tileService";
import { SCORE_WIN } from "../../constants/gameConfig";
import TopBar from "./TopBar";
import HandDisplay from "./HandDisplay";
import HandHistory from "./HandHistory";
import Button from "../shared/Button";

// ─── Game Screen ──────────────────────────────────────────────────────────────
// Orchestrates the two gameplay phases:
//
//   Betting phase  — currentHand shown, bet buttons active
//   Result phase   — both hands shown, result revealed, auto-advance after 2.2s
//
// Navigation side-effects (isGameOver → /gameover, no active game → /) live
// here as useEffects — reducers stay pure.

/** Duration (ms) the result reveal is shown before auto-advancing */
const RESULT_DISPLAY_MS = 2200;

// Direction arrow: reflects the actual movement of the new total vs old.
const directionArrow = (oldTotal, newTotal) => {
  if (newTotal > oldTotal) return "▲";
  if (newTotal < oldTotal) return "▼";
  return "=";
};

const Game = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  const {
    currentHand,
    resolvedHand,
    lastHandResult,
    tileValues,
    drawPile,
    discardPile,
    score,
    reshuffleCount,
    handHistory,
    isGameOver,
    currentBet,
  } = state;

  const isResultPhase = lastHandResult !== null;

  // ── Side-effects ────────────────────────────────────────────────────────────

  // If no active game (e.g. user navigated directly to /game), go to landing.
  useEffect(() => {
    if (!isGameOver && currentHand.length === 0) navigate("/");
  }, [currentHand.length, isGameOver, navigate]);

  // Navigate to /gameover as soon as the reducer sets isGameOver.
  useEffect(() => {
    if (isGameOver) navigate("/gameover");
  }, [isGameOver, navigate]);

  // Auto-advance after result is shown. The countdown CSS animation is synced
  // to this same duration so the visual bar matches the actual timeout.
  useEffect(() => {
    if (!isResultPhase) return;
    const timer = setTimeout(
      () => dispatch({ type: "DRAW_HAND" }),
      RESULT_DISPLAY_MS,
    );
    return () => clearTimeout(timer); // cleared if user clicks Continue early
  }, [isResultPhase, dispatch]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleBet = (bet) => {
    // PLACE_BET then RESOLVE_BET in sequence — both are synchronous reducer
    // calls, so React batches them into a single re-render.
    dispatch({ type: "PLACE_BET", payload: bet });
    dispatch({ type: "RESOLVE_BET" });
  };

  const handleContinue = () => dispatch({ type: "DRAW_HAND" });

  const handleExit = () => {
    dispatch({ type: "RESET_GAME" });
    navigate("/");
  };

  // ── Derived display values ──────────────────────────────────────────────────

  const currentTotal = getHandTotal(currentHand, tileValues);
  const isWin = lastHandResult?.result === "win";
  const arrow = lastHandResult
    ? directionArrow(lastHandResult.oldTotal, lastHandResult.newTotal)
    : null;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar
        onExit={handleExit}
        drawCount={drawPile.length}
        discardCount={discardPile.length}
        reshuffleCount={reshuffleCount}
        score={score}
      />

      {/* ── Main area — grows to fill viewport between TopBar and History ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
        {isResultPhase ? (
          /* ── Result phase ──────────────────────────────────────────────── */
          <div
            key="result"
            className="w-full max-w-2xl flex flex-col items-center gap-6 animate-fade-in"
          >
            {/* Both hands side by side (desktop) / stacked (mobile) */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Old hand — dimmed, no highlight */}
              <HandDisplay
                hand={currentHand}
                tileValues={tileValues}
                label="Your Hand"
                dim
              />

              {/* Comparison indicator */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`text-3xl font-bold transition-colors ${
                    isWin ? "text-success" : "text-error"
                  }`}
                >
                  {arrow}
                </span>
                <span className="text-[11px] text-secondary font-medium uppercase tracking-widest">
                  {lastHandResult.newTotal > lastHandResult.oldTotal
                    ? "higher"
                    : lastHandResult.newTotal < lastHandResult.oldTotal
                      ? "lower"
                      : "tie"}
                </span>
              </div>

              {/* New hand — highlighted with win/loss */}
              <HandDisplay
                hand={resolvedHand}
                tileValues={tileValues}
                label="New Hand"
                highlight={isWin ? "win" : "loss"}
              />
            </div>

            {/* Result badge */}
            <div
              className={`flex flex-col items-center gap-1 px-8 py-4 rounded-[8px] border ${
                isWin
                  ? "bg-[#f0fdf4] border-success text-success"
                  : "bg-[#fef2f2] border-error   text-error"
              }`}
            >
              <span className="text-base font-bold">
                {isWin ? "Correct!" : "Wrong!"}
              </span>
              <span className="text-sm opacity-80">
                {isWin ? `+${SCORE_WIN} point` : "No points this round"}
              </span>
            </div>

            {/* Continue button + countdown progress bar */}
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <Button
                variant={isWin ? "primary" : "secondary"}
                size="md"
                className="w-full"
                onClick={handleContinue}
              >
                Continue →
              </Button>

              {/* Shrinks left-to-right over RESULT_DISPLAY_MS, then DRAW_HAND fires */}
              <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full origin-left animate-countdown"
                  style={{ animationDuration: `${RESULT_DISPLAY_MS}ms` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ── Betting phase ─────────────────────────────────────────────── */
          <div
            key="betting"
            className="flex flex-col items-center gap-8 animate-fade-in"
          >
            {/* Current hand */}
            <HandDisplay hand={currentHand} tileValues={tileValues} />

            {/* Total + prompt */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-4xl font-bold text-primary tabular-nums">
                {currentTotal}
              </p>
              <p className="text-sm text-secondary">
                Will the next hand be higher or lower?
              </p>
            </div>

            {/* Bet buttons */}
            <div className="flex gap-3">
              <Button
                variant="lower"
                size="lg"
                onClick={() => handleBet("lower")}
                disabled={!!currentBet}
              >
                Bet Lower ▼
              </Button>
              <Button
                variant="higher"
                size="lg"
                onClick={() => handleBet("higher")}
                disabled={!!currentBet}
              >
                Bet Higher ▲
              </Button>
            </div>
          </div>
        )}
      </main>

      <HandHistory handHistory={handHistory} />
    </div>
  );
};

export default Game;
