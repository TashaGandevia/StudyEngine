# Study Game Engine

A content-agnostic, client-side engine for building **gamified study games**.

It provides the entire learning loop — progression, scoring, retention,
motivation, and persistence — while staying completely independent of _what_ is
being taught. Supply your own questions and interactions and you have a complete
study game for any subject.

## What it's meant to do

Turn study material into a game that's actually motivating to play, without
rebuilding the game systems every time the subject changes. The guiding
principle is **content is data, logic is code, and the two never mix** — so the
engine knows nothing about your subject, and adapting it to a new course means
changing data, not the engine.

## What's inside

- **Flow machine** — drives navigation between screens (title, overworld, topic
  intro, play, boss, results, capstone) with pause/profile overlays.
- **Progression** — XP, a level curve, and a combo/streak multiplier.
- **Lives** — forgiving practice rounds; tense "boss" checkpoints.
- **Scoring** — accuracy and a 0–3 star rating per topic.
- **Retention** — a spaced-repetition review queue that feeds missed items back
  into future rounds.
- **Motivation** — data-driven badges/achievements.
- **Persistence** — save/restore progress, with export and reset.
- **Theming & motion** — light/dark tokens, shared UI primitives, and animation
  with a reduced-motion guard.

All game state lives in a single reducer; interactions report results through
`onAnswer`/`onComplete` callbacks and never mutate state directly.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # lint
npm test         # run the engine test suite (Vitest)
```

## Documentation

- **[docs/ENGINE.md](docs/ENGINE.md)** — how to use the engine: architecture, the
  content schema, building rounds, registering interactions, retargeting it to a
  new subject, and the tuning knobs.

## Tech

React + Vite, Tailwind for styling, a reducer/context store for game state,
Framer Motion for animation, and `localStorage` for persistence. Client-side
only — no backend required.
