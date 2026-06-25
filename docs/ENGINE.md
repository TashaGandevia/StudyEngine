# Study Game Engine

A content-agnostic, client-side engine for building **gamified study games**. It
provides the entire learning loop — progression, scoring, retention, motivation,
and persistence — while staying completely independent of *what* is being taught.
Drop in your own questions and interactions and you have a complete study game
for any subject.

> **Core principle:** content is data, logic is code, and the two never mix.
> The engine knows nothing about your subject matter. To teach something new you
> change **data**, not the engine.

---

## What the engine gives you

A single source of truth (a reducer) tracks a full playthrough:

```js
state = {
  flow,        // which screen is showing (navigation state machine)
  overlay,     // pause / profile overlay, or none
  zoneId,      // the active topic/unit
  player,      // lifetime XP (level is derived)
  zones,       // per-topic progress: unlocked, completed, bestAccuracy, stars
  run,         // the active round: queue, index, lives, combo, correct, total, xp
  badges,      // earned achievement ids
  reviewQueue, // missed items awaiting re-practice
  settings,    // sound, reduced motion, ...
}
```

Built on top of it:

| System | What it does |
|---|---|
| **Flow machine** | Declarative state table driving navigation: `TITLE → ONBOARDING → OVERWORLD → TOPIC_INTRO → PLAYING → BOSS → RESULTS` (+ `CAPSTONE → END`), with pause/profile overlays that suspend and resume. |
| **XP & leveling** | XP per correct answer = base × difficulty multiplier × combo multiplier; level curve `100·n^1.5`; level-up banner. |
| **Combo / streak** | Consecutive correct answers raise a multiplier (caps at ×2); a wrong answer resets it. Visual combo meter with an "on fire" flourish. |
| **Lives** | Practice rounds are forgiving (no lives); "boss" checkpoints use 3 lives, and failing retries the boss, not the whole topic. |
| **Scoring, accuracy & stars** | Round score = accumulated XP; accuracy = correct/total; 0–3 stars by accuracy thresholds (70/85/95%). Replays only improve a topic's record. |
| **Badges** | Data-driven achievements with `test(run)` predicates, evaluated on round completion. |
| **Review queue (spaced repetition)** | A missed item must be answered correctly twice (not necessarily consecutively) before it clears. Feeds back into future rounds. |
| **Run builder** | `buildRun()` assembles each round from a topic's question bank, biased toward review items and ordered along a difficulty curve. Seeded RNG for reproducible ("daily") runs. |
| **Persistence** | Versioned `localStorage` save/restore with export and reset; degrades to in-memory when storage is unavailable. |
| **Theming & motion** | Themeable color tokens (light/dark), shared UI primitives, and animation presets with a reduced-motion guard. |

---

## Architecture

```
src/
├─ state/
│  ├─ gameReducer.js      // the single source of truth; all transitions
│  ├─ GameProvider.jsx    // context provider; exposes state + action helpers
│  ├─ gameContext.js      // useGame() hook
│  ├─ flowMachine.js      // navigation state machine (pure)
│  └─ selectors.js        // derived values (level progress, accuracy, ...)
├─ lib/                   // pure, framework-free game logic (easy to test)
│  ├─ leveling.js         // xpForAnswer, level curve
│  ├─ combo.js            // combo multiplier
│  ├─ scoring.js          // accuracy, stars
│  ├─ reviewQueue.js      // spaced-repetition rule
│  ├─ buildRun.js         // round assembly
│  ├─ rng.js              // seeded RNG + shuffle
│  └─ persistence.js      // save / load / export / reset
├─ data/                  // CONTENT — the part you change per subject
│  ├─ zones.js            // topic/unit metadata + order
│  ├─ badges.js           // achievement definitions
│  └─ challenges/         // one question bank per topic, sharing a schema
├─ minigames/             // interaction components + a type→component router
├─ components/            // reusable UI primitives + HUD widgets
└─ screens/               // the screens for each flow state
```

### One-directional data flow

Interactions never mutate state directly. They receive two callbacks and emit
results through them; the reducer owns all the consequences (XP, combo, lives,
unlocks, the review queue):

```jsx
<MiniGame
  challenge={challengeObject}
  onAnswer={(isCorrect, meta) => { /* engine updates combo/XP/review */ }}
  onComplete={() => { /* round finished */ }}
/>
```

`GameProvider` exposes named action helpers (`startRun`, `answer`, `completeRun`,
`selectZone`, …) but **not** the raw dispatch — so the only way an interaction
can affect state is the sanctioned path above.

---

## The content contract

Every question is a plain object sharing a core schema, plus type-specific fields:

```js
{
  id,          // unique, e.g. "t1_004"
  zone,        // which topic/unit it belongs to
  type,        // selects which interaction component renders it
  difficulty,  // 'easy' | 'med' | 'hard'
  prompt,      // what the learner sees
  answer,      // the correct answer (shape depends on type)
  explain,     // one-line reinforcement shown after answering
  // ...any type-specific fields (choices, pairs, code, table, ...)
}
```

`type` is the join between content and interaction: the **type→component router**
maps each `type` string to the component that renders it. Unregistered types fall
back to a simple component, so the game stays playable as you add interactions.

---

## Retargeting it to a new subject

Because the engine is content-agnostic, adapting it to a new course or subject
means editing **data and interactions**, never the core logic:

| To change | Edit | Leave untouched |
|---|---|---|
| Topics / units | `data/zones.js` (names, order, colors) | `state/`, `lib/` |
| Questions | `data/challenges/*` (objects matching the schema) | reducer, `buildRun`, scoring |
| Interaction styles | add a component + register its `type` | the router resolves it |
| Achievements | `data/badges.js` `test(run)` predicates | unlock logic |
| Feel / balance | knobs in `lib/` (see below) | everything else |

The reusable kernel is essentially:
`reducer + selectors + lib/{leveling, combo, scoring, reviewQueue, buildRun, rng} + persistence`.

### Tuning knobs (no content changes needed)

| Constant | Location | Effect |
|---|---|---|
| `BASE_XP`, `DIFFICULTY_MULT` | `lib/leveling.js` | XP per answer |
| level curve `100·n^1.5` | `lib/leveling.js` | how fast levels come |
| `COMBO_CAP` (×2 at 5) | `lib/combo.js` | streak reward ceiling |
| `STAR_THRESHOLDS` (0.70/0.85/0.95) | `lib/scoring.js` | star difficulty |
| `REQUIRED_CORRECT` (2) | `lib/reviewQueue.js` | how hard to clear a missed item |
| `count`, `difficultyCurve`, `reviewBias` | `buildRun()` options | round length, ramp, review weighting |

### Example subjects it suits as-is

- **Any academic course** — swap question banks for the subject's topics.
- **Language learning** — vocabulary/grammar as questions; the review queue is
  already spaced-repetition flashcards.
- **Exam / certification prep** — scenarios as "boss" checkpoints; stars track
  per-topic mastery.
- **Onboarding / compliance training** — units as topics, a capstone as the
  final assessment.

---

## Design pillars

1. **Progression is the lesson structure.** Topics unlock in order, so advancing
   through the game mirrors advancing through the curriculum.
2. **Every concept gets a matching interaction.** Mechanics that *mimic* the idea
   beat walls of multiple choice.
3. **Fast feedback, visible progress.** Immediate correct/incorrect response, an
   XP bar, a combo meter, badges.
4. **Content is data, not code.** Questions live in plain data files separate
   from logic — so the engine is reusable and content is easy to author.

---

## Tech

Client-side only, no backend required. React + a reducer/context store for game
state, `useState` for local interaction state, a small animation layer with a
reduced-motion guard, and `localStorage` for persistence.
