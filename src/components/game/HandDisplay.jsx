import TileCard from "../shared/TileCard";
import { getTileValue, getHandTotal } from "../../services/tileService";

// ─── HandDisplay ──────────────────────────────────────────────────────────────
// Renders a row of TileCards for a hand + the computed total beneath.
// Used for both the active hand (betting phase) and the comparison hands
// (result phase). Computes total internally so callers stay clean.

const HandDisplay = ({
  hand,
  tileValues,
  label     = null,   // optional section heading ("Your Hand", "New Hand")
  highlight = null,   // null | 'win' | 'loss' — passed through to every TileCard
  dim       = false,  // slightly muted when showing the old hand alongside result
  className = "",
}) => {
  if (!hand || hand.length === 0) return null;

  const total = getHandTotal(hand, tileValues);

  return (
    <div className={`flex flex-col items-center gap-3 ${dim ? "opacity-60" : ""} ${className}`}>

      {label && (
        <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest">
          {label}
        </p>
      )}

      {/* Tile row */}
      <div className="flex gap-2.5">
        {hand.map((tile) => (
          <TileCard
            key={tile.instanceId}
            tile={tile}
            value={getTileValue(tile, tileValues)}
            size="md"
            highlight={highlight}
          />
        ))}
      </div>

      {/* Hand total */}
      <p className={`text-sm text-secondary ${dim ? "" : "font-medium"}`}>
        Total&nbsp;
        <span className={`font-bold tabular-nums ${dim ? "text-secondary text-xl" : "text-primary text-2xl"}`}>
          {total}
        </span>
      </p>

    </div>
  );
};

export default HandDisplay;
