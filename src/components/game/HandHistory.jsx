// ─── HandHistory ──────────────────────────────────────────────────────────────
// Scrollable list of resolved hands at the bottom of the game screen.
// Renders tiles as plain emojis — individual tile values are NOT shown here
// because tileValues shift each round, making historical per-tile values
// misleading. The recorded hand total is the authoritative figure.

const BET_ARROW = { higher: "▲", lower: "▼" };

const HandHistory = ({ handHistory }) => {
  if (handHistory.length === 0) return null;

  // Most recent hand at the top
  const reversed = [...handHistory].reverse();

  return (
    <section className="border-t border-border bg-surface shrink-0">

      {/* Section header */}
      <div className="px-5 pt-3 pb-1">
        <h3 className="text-[11px] font-semibold text-secondary uppercase tracking-widest">
          History
        </h3>
      </div>

      {/* Scrollable rows */}
      <div className="max-h-40 overflow-y-auto divide-y divide-border">
        {reversed.map((entry, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-2"
          >
            {/* Tile emojis */}
            <div className="flex gap-1" aria-label="tiles in hand">
              {entry.tiles.map((tile) => (
                <span
                  key={tile.instanceId}
                  className="text-xl leading-none"
                  role="img"
                  aria-label={tile.name}
                >
                  {tile.emoji}
                </span>
              ))}
            </div>

            {/* Total */}
            <span className="text-sm font-semibold text-primary tabular-nums">
              = {entry.total}
            </span>

            {/* Bet direction */}
            <span className="text-xs text-secondary">
              bet {BET_ARROW[entry.bet]} {entry.bet}
            </span>

            {/* Win / Loss indicator */}
            <span
              className={`ml-auto text-sm font-bold ${
                entry.result === "win" ? "text-success" : "text-error"
              }`}
              aria-label={entry.result === "win" ? "win" : "loss"}
            >
              {entry.result === "win" ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default HandHistory;
