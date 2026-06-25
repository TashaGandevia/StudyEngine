// PauseOverlay (INF-4 stub; SYS-2 controls) — the PAUSED overlay. Built out in
// UI-9 (settings: sound, reduced motion). Closing resumes the suspended screen.
//
// SYS-2 adds Export (download save) and Reset (wipe progress) controls here so
// they're usable/testable now; UI-9 will give them their real settings UI.
import { Button } from '../components';
import { useFlow } from '../state/flowContext.js';
import Overlay from './Overlay.jsx';

export default function PauseOverlay() {
  const { closePause, exportSave, resetGame } = useFlow();

  function handleReset() {
    // Guard a destructive action behind a confirm; UI-9 can replace with a
    // nicer in-app confirmation.
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetGame();
      closePause();
    }
  }

  return (
    <Overlay title="Paused" onClose={closePause}>
      <p className="text-text-muted">Settings live here (UI-9).</p>
      <Button onClick={closePause}>Resume</Button>
      <Button variant="secondary" onClick={exportSave}>
        Export save
      </Button>
      <Button variant="ghost" onClick={handleReset}>
        Reset progress
      </Button>
    </Overlay>
  );
}
