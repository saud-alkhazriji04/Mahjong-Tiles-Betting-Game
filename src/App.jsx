import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Landing from "./components/landing/Landing";
import Game from "./components/game/Game";
import GameOver from "./components/game/GameOver";
import "./App.css";

const App = () => {
  return (
    // GameProvider wraps BrowserRouter so all routes share the same game state.
    // This means navigating between routes never loses in-flight game data.
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/gameover" element={<GameOver />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
};

export default App;
