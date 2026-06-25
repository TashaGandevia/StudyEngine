// App (INF-4, updated SYS-1) — the app shell: providers + the flow router.
//
// App wires up GameProvider (the global game state, which now also owns the
// flow machine), then FlowRouter reads the current flow state and renders the
// matching screen, with the active overlay (pause/profile) floating on top.
// Screen and overlay changes are animated via AnimatePresence using the INF-3
// motion presets (and stay calm under reduced motion).
//
// The screens are INF-4 stubs; M2/M3 replace each with its real implementation.
import { AnimatePresence } from 'framer-motion';
import GameProvider from './state/GameProvider.jsx';
import { useFlow } from './state/flowContext.js';
import { FLOW, OVERLAY } from './state/flowMachine.js';
import { LevelUpBanner } from './components';

import TitleScreen from './screens/TitleScreen.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Overworld from './screens/Overworld.jsx';
import ZoneIntro from './screens/ZoneIntro.jsx';
import PlayingScreen from './screens/PlayingScreen.jsx';
import BossScreen from './screens/BossScreen.jsx';
import Results from './screens/Results.jsx';
import Capstone from './screens/Capstone.jsx';
import EndScreen from './screens/EndScreen.jsx';
import PauseOverlay from './screens/PauseOverlay.jsx';
import ProfileOverlay from './screens/ProfileOverlay.jsx';

// One screen component per flow state.
const SCREENS = {
  [FLOW.TITLE]: TitleScreen,
  [FLOW.ONBOARDING]: Onboarding,
  [FLOW.OVERWORLD]: Overworld,
  [FLOW.ZONE_INTRO]: ZoneIntro,
  [FLOW.PLAYING]: PlayingScreen,
  [FLOW.BOSS]: BossScreen,
  [FLOW.RESULTS]: Results,
  [FLOW.CAPSTONE]: Capstone,
  [FLOW.END]: EndScreen,
};

// One overlay component per overlay state.
const OVERLAYS = {
  [OVERLAY.PAUSED]: PauseOverlay,
  [OVERLAY.PROFILE]: ProfileOverlay,
};

function FlowRouter() {
  const { flow, overlay } = useFlow();
  const Screen = SCREENS[flow];
  const ActiveOverlay = overlay ? OVERLAYS[overlay] : null;

  return (
    <>
      {/* Screen layer: mode="wait" lets the outgoing screen finish exiting
          before the next enters. Keyed by flow so each change animates. */}
      <AnimatePresence mode="wait">
        <Screen key={flow} />
      </AnimatePresence>

      {/* Overlay layer: rendered above the (still-mounted) screen, so closing
          resumes exactly where the player left off. Keyed by overlay. */}
      <AnimatePresence>
        {ActiveOverlay && <ActiveOverlay key={overlay} />}
      </AnimatePresence>

      {/* Global level-up banner (SYS-3): floats above everything, self-dismisses. */}
      <LevelUpBanner />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <FlowRouter />
    </GameProvider>
  );
}
