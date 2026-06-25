// Results (INF-4 stub; SYS-6 stars/accuracy) — flow state RESULTS. Built out in
// UI-7 (full XP / accuracy / stars / new badges / weakest-concept callout).
//
// The run has already been finalized into zone progress by completeRun, so this
// reads the completed zone's stored stars + best accuracy.
import { Button } from '../components';
import { useFlow } from '../state/flowContext.js';
import ScreenStub from './ScreenStub.jsx';

export default function Results() {
  const { zoneId, zones, finishResults, replayZone } = useFlow();
  const zone = zones[zoneId];
  const stars = zone?.stars ?? 0;
  const accuracyPct = Math.round((zone?.bestAccuracy ?? 0) * 100);

  return (
    <ScreenStub
      title="Zone Results"
      subtitle={`Zone ${zoneId ?? '?'} — XP, accuracy, stars (UI-7)`}
    >
      <div className="w-full text-center">
        {/* Filled vs empty stars out of 3. */}
        <div
          className="text-2xl text-zone4-500"
          aria-label={`${stars} of 3 stars`}
        >
          {'★'.repeat(stars)}
          <span className="text-text-muted">{'☆'.repeat(3 - stars)}</span>
        </div>
        <div className="mt-1 text-sm text-text-muted">
          Best accuracy: {accuracyPct}%
        </div>
      </div>
      <Button onClick={finishResults}>Continue</Button>
      <Button variant="secondary" onClick={replayZone}>
        Replay zone
      </Button>
    </ScreenStub>
  );
}
