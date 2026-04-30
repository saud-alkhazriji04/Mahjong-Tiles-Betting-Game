import { createContext, useContext, useReducer } from "react";
import gameReducer, { initialState } from "./gameReducer";

// ─── Context ──────────────────────────────────────────────────────────────────
const GameContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
// Wraps the entire app (in App.jsx) so every route can access game state.
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
// useGame() is the single access point for all components.
// Throws if used outside <GameProvider> to surface wiring mistakes early.
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a <GameProvider>");
  return context;
};
