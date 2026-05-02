# Hand Betting Game

A web-based card game built with React and Mahjong tiles, created as a technical assessment for Penny Software.

---

## About the Game

Hand Betting Game is a web-based card game using Mahjong tiles. Each round, you are dealt a hand of tiles with a total value. Your goal is to predict whether the next hand's total will be **higher** or **lower** than the current one.

The twist: Dragon and Wind tile values are **dynamic** — they shift based on whether they appear in winning or losing hands, so the stakes change as the game progresses.

---

## Rules

### Tiles

| Tile Type     | Value                                 |
| ------------- | ------------------------------------- |
| Number (1–9)  | Face value                            |
| Dragon & Wind | Base value of 5 (dynamic — see below) |

Dragon and Wind tile values change dynamically:

- Appears in a **winning** hand → value increases by 1
- Appears in a **losing** hand → value decreases by 1

### Gameplay

1. You are dealt **3 tiles** each round.
2. Bet **Higher** or **Lower** based on the current hand's total value.
3. The next hand is revealed and compared to the current one.
4. **Ties count as a loss.**

### Win / Loss Conditions

- **You Win** if any tile type's value reaches **10**.
- **You Lose** if any tile type's value reaches **0**.
- **Game Over** if the draw pile runs out **3 times**.

### Scoring

- Each correct guess increases your score.
- Top **5 scores** are saved to the leaderboard.

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/saud-alkhazriji04/Mahjong-Tiles-Betting-Game.git

# 2. Navigate into the project
cd Mahjong-Tiles-Betting-Game

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open your browser at **http://localhost:5173**

---

## Tech Stack

| Layer     | Technology         |
| --------- | ------------------ |
| Framework | React + JavaScript |
| Styling   | Tailwind CSS       |
| Routing   | React Router       |
| Build     | Vite               |

---

## Architecture Overview

The app is structured around a single `useReducer` hook that serves as the central state machine for all game logic. Actions dispatched from UI components flow into the reducer, which delegates to a **services layer** for domain-specific operations.

```
src/
├── components/
│   ├── game/         # Game screen (Game, GameOver, HandDisplay, HandHistory, TopBar)
│   ├── landing/      # Landing page (Landing)
│   ├── leaderboard/  # Leaderboard screen (Leaderboard)
│   └── shared/       # Reusable UI (Button, TileCard)
├── constants/        # Static config and tile definitions (gameConfig, tiles)
├── context/          # Game state (GameContext, gameReducer)
├── services/         # Domain logic (deckService, tileService, scoreService)
├── assets/           # Static files (currently empty)
└── App.jsx
```

State changes (tile value shifts, score updates, win/loss evaluation) are handled entirely within the reducer and its service delegates — components remain display-only.

---

## Design Decisions

**`useReducer` over `useState`**
Chosen because the assessment prioritized scalable, feature-ready architecture. All game logic is centralized in the reducer and delegates to a services layer for easy extension.

**Services layer**
Deck, tile, and score logic are separated into individual service files to keep the reducer clean and make future feature additions straightforward.

**Clean & minimal design**
Chosen to align with Penny's minimalist brand values.

---

## AI Usage

**Code**
Some reducer functions was generated and refined with Claude based on detailed descriptions of the intended behavior. JSDoc annotations and code comments were added/restructured with Claude's assistance.

**Styling**
UI styling was implemented by Claude based on a Figma design I created. Minor adjustments were made manually.
