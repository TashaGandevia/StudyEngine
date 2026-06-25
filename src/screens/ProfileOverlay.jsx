// ProfileOverlay (INF-4 stub; SYS-7 badge shelf) — the PROFILE overlay. Built
// out in UI-8 (level, total XP, badge shelf, per-zone accuracy, review-queue
// size). For now it shows the data-driven badge shelf. Closing resumes the
// screen underneath.
import { Button, BadgeShelf } from '../components';
import { useFlow } from '../state/flowContext.js';
import Overlay from './Overlay.jsx';

export default function ProfileOverlay() {
  const { closeProfile } = useFlow();
  return (
    <Overlay title="Profile" onClose={closeProfile}>
      <BadgeShelf />
      <Button onClick={closeProfile}>Close</Button>
    </Overlay>
  );
}
