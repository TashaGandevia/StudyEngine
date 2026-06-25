// PlayingScreen (INF-4 stub → SYS-4 M1 test harness) — flow state PLAYING.
//
// The real playfield is the MiniGameShell + per-zone mini-games (UI-5, M3).
// Until those exist, this drives the game engine directly so combo/XP/lives are
// exercisable in-app: it starts a run on entry and offers correct/wrong answer
// buttons that flow through answer() — the same onAnswer path real mini-games
// will use. It also shows the live ComboMeter (SYS-4).
import { useEffect } from 'react';
import { Button, ComboMeter } from '../components';
import { useFlow } from '../state/flowContext.js';
import ScreenStub from './ScreenStub.jsx';

export default function PlayingScreen() {
  const { zoneId, run, startRun, answer, startBoss, openPause } = useFlow();

  // Start a run on entry if none is active.
  useEffect(() => {
    if (!run) startRun(zoneId ?? 'z1');
    // Run once on mount; startRun/run intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (correct) =>
    answer({
      correct,
      difficulty: 'med',
      challengeId: `${zoneId ?? 'z1'}_t${run?.index ?? 0}`,
    });

  return (
    <ScreenStub
      title="Playing"
      subtitle={`Zone ${zoneId ?? '?'} — M1 engine harness (UI-5/M3)`}
    >
      {run && (
        <div className="w-full text-sm text-text-muted">
          correct {run.correct} / {run.total} · xp {run.xpThisRun}
        </div>
      )}
      <div className="w-full">
        <ComboMeter />
      </div>
      <Button onClick={() => submit(true)}>Answer correct</Button>
      <Button variant="secondary" onClick={() => submit(false)}>
        Answer wrong
      </Button>
      <Button variant="ghost" onClick={startBoss}>
        Go to boss
      </Button>
      <Button variant="ghost" onClick={openPause}>
        Pause
      </Button>
    </ScreenStub>
  );
}
