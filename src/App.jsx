// Root component.
//
// TEMPORARY SHOWCASE (INF-2): this renders the design tokens and shared
// primitives so the theme can be verified by eye. INF-4 replaces this body with
// the real flow state machine (TITLE → ONBOARDING → OVERWORLD → ...) and the
// M1 context providers.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Pill, ProgressBar } from './components';
import { slideUp, pulse } from './lib/motion';

// Zone identity colors from the GDD, used only to demo the zone ramps here.
const ZONES = [
  { id: 'zone1', name: 'The Wire', swatch: 'bg-zone1-500' },
  { id: 'zone2', name: 'The Frontier', swatch: 'bg-zone2-500' },
  { id: 'zone3', name: 'The Engine Room', swatch: 'bg-zone3-500' },
  { id: 'zone4', name: 'The Vault', swatch: 'bg-zone4-500' },
  { id: 'zone5', name: 'The Launchpad', swatch: 'bg-zone5-500' },
];

export default function App() {
  // Local dark-mode toggle for the showcase. The real toggle lives in the
  // settings overlay (UI-9) and will read/write game state instead.
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Full-Stack Quest</h1>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {dark ? 'Light mode' : 'Dark mode'}
          </Button>
        </header>

        <p className="text-text-muted">
          Design tokens &amp; primitives (INF-2). Real flow lands in INF-4.
        </p>

        {/* Buttons */}
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Buttons</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Card>

        {/* Pills */}
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Pills</h2>
          <div className="flex flex-wrap gap-2">
            <Pill>Neutral</Pill>
            <Pill tone="accent">Accent</Pill>
            <Pill className="bg-zone3-100 text-zone3-700">Zone-colored</Pill>
          </div>
        </Card>

        {/* Progress bar */}
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Progress</h2>
          <ProgressBar value={62} max={100} label="Demo progress" />
        </Card>

        {/* Zone ramps */}
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Zone colors</h2>
          <div className="flex flex-wrap gap-3">
            {ZONES.map((z) => (
              <div key={z.id} className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded ${z.swatch}`} />
                <span className="text-sm text-text-muted">{z.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Motion presets (INF-3). The slideUp preset animates this card in;
            the pulse button demos feedback motion. Both are automatically
            toned down when the user prefers reduced motion. */}
        <motion.div {...slideUp}>
          <Card>
            <h2 className="mb-3 text-lg font-semibold">Motion</h2>
            <motion.div className="inline-block" {...pulse}>
              <Pill tone="accent">Pulsing feedback</Pill>
            </motion.div>
          </Card>
        </motion.div>

        {/* Mono font sample (Code Lab) */}
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Monospace</h2>
          <pre className="font-mono text-sm text-text-muted">
            res.status(200).json(users);
          </pre>
        </Card>
      </div>
    </main>
  );
}
