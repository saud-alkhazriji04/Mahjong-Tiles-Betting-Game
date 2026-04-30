// ─── TileCard ─────────────────────────────────────────────────────────────────
// Displays one tile: emoji, name, and its current value.
// Purely presentational — the caller computes `value` via getTileValue().
//
// Sizes:
//   sm  — hand history (compact, stacked rows)
//   md  — active/resolved hands on the game screen
//
// Highlights:
//   null  — default neutral style
//   'win' — green border + glow (correct bet result)
//   'loss'— red border + glow  (incorrect bet result)

// Full class strings written out explicitly so Tailwind's scanner picks them up.
const SIZE_STYLES = {
  sm: {
    card:  "w-16 min-h-[4.5rem] p-2 gap-0.5",
    emoji: "text-2xl leading-none",
    name:  "text-[10px] leading-tight",
    badge: "text-[10px] px-1.5 py-0.5",
  },
  md: {
    card:  "w-24 min-h-[7rem] p-3 gap-1",
    emoji: "text-4xl leading-none",
    name:  "text-xs leading-snug",
    badge: "text-xs px-2 py-0.5",
  },
};

const HIGHLIGHT_STYLES = {
  win:  "border-success shadow-[0_0_0_3px_rgba(22,163,74,0.15)]",
  loss: "border-error  shadow-[0_0_0_3px_rgba(220,38,38,0.15)]",
};

/**
 * @param {{
 *   tile:      object,
 *   value:     number,
 *   size?:     'sm' | 'md',
 *   highlight?: null | 'win' | 'loss',
 *   className?: string,
 * }} props
 */
const TileCard = ({ tile, value, size = "md", highlight = null, className = "" }) => {
  const s = SIZE_STYLES[size];
  const highlightClass = highlight ? HIGHLIGHT_STYLES[highlight] : "border-border shadow-sm";

  return (
    <div
      className={
        `flex flex-col items-center justify-between bg-surface border rounded-[8px] ` +
        `transition-all duration-300 ${s.card} ${highlightClass} ${className}`
      }
    >
      {/* Tile emoji */}
      <span className={s.emoji} role="img" aria-label={tile.name}>
        {tile.emoji}
      </span>

      {/* Tile name — wraps for long names like "White Dragon" */}
      <span className={`${s.name} text-secondary text-center w-full`}>
        {tile.name}
      </span>

      {/* Current value badge */}
      <span
        className={
          `${s.badge} bg-background text-primary font-semibold rounded-full ` +
          `tabular-nums leading-none`
        }
      >
        {value}
      </span>
    </div>
  );
};

export default TileCard;
