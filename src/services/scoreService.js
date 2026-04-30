import {
  SCORE_WIN,
  SCORE_LOSS,
  LEADERBOARD_SIZE,
  LEADERBOARD_STORAGE_KEY,
} from "../constants/gameConfig";

// ─── Score Service ────────────────────────────────────────────────────────────
// Handles score arithmetic and leaderboard persistence via localStorage.

/**
 * Returns the updated score after a bet result.
 * Score is floored at 0 — it can never go negative.
 * @param {number}          currentScore
 * @param {'win' | 'loss'}  result
 * @returns {number}
 */
export const calculateScore = (currentScore, result) => {
  const delta = result === "win" ? SCORE_WIN : -SCORE_LOSS;
  return Math.max(0, currentScore + delta);
};

/**
 * Reads the leaderboard from localStorage.
 * Returns an empty array if nothing is stored or the data is malformed.
 * @returns {{ score: number, date: string }[]}
 */
export const getLeaderboard = () => {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupted storage — treat as empty rather than crashing
    return [];
  }
};

/**
 * Adds a score to the leaderboard, keeps the top LEADERBOARD_SIZE entries,
 * and persists back to localStorage.
 * @param {number} score
 * @returns {{ score: number, date: string }[]} updated leaderboard
 */
export const saveToLeaderboard = (score) => {
  const updated = [...getLeaderboard(), { score, date: new Date().toISOString().split("T")[0] }]
    .sort((a, b) => b.score - a.score)
    .slice(0, LEADERBOARD_SIZE);

  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private browsing, storage full) — fail silently,
    // leaderboard is non-critical and should not break the game
  }

  return updated;
};
