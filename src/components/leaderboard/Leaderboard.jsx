import { useState } from "react";
import { getLeaderboard } from "../../services/scoreService";

// ─── Leaderboard ──────────────────────────────────────────────────────────────
// Reads top scores from localStorage on mount (via useState initialiser so it
// only runs once per render cycle). Purely display — no dispatch needed.

// Rank 1 gets a warm accent; 2–3 get muted; 4–5 are plain.
const RANK_STYLES = [
  "bg-amber-50  text-amber-600  border-amber-200",
  "bg-gray-100  text-gray-500   border-gray-200",
  "bg-orange-50 text-orange-500 border-orange-200",
  "bg-gray-50   text-gray-400   border-gray-200",
  "bg-gray-50   text-gray-400   border-gray-200",
];

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

const Leaderboard = () => {
  const [entries] = useState(() => getLeaderboard());

  return (
    <div className="bg-surface border border-border rounded-[8px] p-6 shadow-sm w-full">
      <h2 className="text-base font-semibold text-primary mb-1">Top Scores</h2>
      <p className="text-xs text-secondary mb-5">Best {entries.length > 0 ? entries.length : ""} results</p>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-10 text-center">
          <p className="text-secondary text-sm font-medium">No scores yet.</p>
          <p className="text-secondary text-xs">Play your first game to appear here.</p>
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {entries.map((entry, i) => (
            <li
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 bg-background rounded-[6px] border border-border"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Rank badge */}
              <span
                className={
                  `w-6 h-6 flex-shrink-0 flex items-center justify-center ` +
                  `rounded-full border text-[11px] font-semibold ${RANK_STYLES[i]}`
                }
              >
                {i + 1}
              </span>

              {/* Score */}
              <span className="flex-1 font-semibold text-primary tabular-nums">
                {entry.score}
                <span className="text-xs font-normal text-secondary ml-1">pts</span>
              </span>

              {/* Date */}
              <span className="text-xs text-secondary">{formatDate(entry.date)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
