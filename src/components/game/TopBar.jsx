import Button from "../shared/Button";
import { MAX_RESHUFFLES } from "../../constants/gameConfig";

// ─── TopBar ───────────────────────────────────────────────────────────────────
// Persistent header shown throughout the game.
// Displays: exit control, title, live deck counts, reshuffles remaining, score.

const TopBar = ({ onExit, drawCount, discardCount, reshuffleCount, score }) => {
  const reshufflesLeft = MAX_RESHUFFLES - reshuffleCount;

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-3 bg-surface border-b border-border shrink-0">

      {/* Exit */}
      <Button variant="secondary" size="sm" onClick={onExit}>
        Exit
      </Button>

      {/* Centre: title + deck counts */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="font-semibold text-primary text-sm leading-none">
          Hand Betting Game
        </span>
        <span className="text-[11px] text-secondary tabular-nums">
          Draw&nbsp;
          <span className="font-medium text-primary">{drawCount}</span>
          &nbsp;·&nbsp;
          Discard&nbsp;
          <span className="font-medium text-primary">{discardCount}</span>
          &nbsp;·&nbsp;
          {reshufflesLeft === 1
            ? <span className="text-error font-medium">1 reshuffle left</span>
            : <span>{reshufflesLeft} reshuffles left</span>
          }
        </span>
      </div>

      {/* Score */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[11px] text-secondary leading-none">Score</span>
        <span className="text-lg font-bold text-primary tabular-nums leading-none">
          {score}
        </span>
      </div>

    </header>
  );
};

export default TopBar;
