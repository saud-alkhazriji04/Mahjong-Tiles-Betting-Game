import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import Button from "../shared/Button";
import Leaderboard from "../leaderboard/Leaderboard";

// ─── Landing Page ─────────────────────────────────────────────────────────────
// Desktop: two-column split — game info left, leaderboard right.
// Mobile:  single column — game info on top, leaderboard below.

// A hand of tiles shown as decorative art on the landing page.
const DECORATIVE_TILES = [
  { emoji: "🀄", label: "Red Dragon"   },
  { emoji: "🀅", label: "Green Dragon" },
  { emoji: "🀆", label: "White Dragon" },
  { emoji: "🀀", label: "East Wind"    },
  { emoji: "🀁", label: "South Wind"   },
  { emoji: "🀃", label: "North Wind"   },
];

const Landing = () => {
  const navigate  = useNavigate();
  const { dispatch } = useGame();

  const handleNewGame = () => {
    dispatch({ type: "START_GAME" });
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* ── Left: game info ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 animate-fade-up">

          {/* Eyebrow + title */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-secondary uppercase tracking-[0.15em]">
              Mahjong · Higher or Lower
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-primary leading-[1.05]">
              Hand<br />Betting<br />Game
            </h1>
            <p className="text-secondary text-base mt-1 leading-relaxed">
              Guess if the next hand is higher or lower.<br />
              Watch the tiles evolve with every round.
            </p>
          </div>

          {/* Decorative tile grid */}
          <div className="grid grid-cols-3 gap-2 w-fit">
            {DECORATIVE_TILES.map((t, i) => (
              <div
                key={t.label}
                className={
                  "w-[4.5rem] h-[4.5rem] bg-surface border border-border rounded-[8px] " +
                  "flex items-center justify-center text-[2rem] shadow-sm " +
                  "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                }
                style={{ animationDelay: `${i * 55}ms` }}
                role="img"
                aria-label={t.label}
              >
                {t.emoji}
              </div>
            ))}
          </div>

          <Button onClick={handleNewGame} size="lg" className="w-fit px-10">
            New Game
          </Button>
        </div>

        {/* ── Right: leaderboard ────────────────────────────────────────────── */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <Leaderboard />
        </div>

      </div>
    </div>
  );
};

export default Landing;
