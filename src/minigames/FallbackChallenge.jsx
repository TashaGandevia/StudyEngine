// FallbackChallenge (SYS-9) — rendered for a challenge whose `type` has no
// mini-game registered yet. It keeps the run playable before the real
// mini-games land (M3): it shows the prompt and lets the player mark it, routing
// through the same onAnswer/onComplete contract every mini-game uses.
import { Button, Card } from '../components';

export default function FallbackChallenge({ challenge, onAnswer, onComplete }) {
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-wide text-text-muted">
        No mini-game for type “{challenge?.type}” yet (M3)
      </p>
      {challenge?.prompt && <p className="font-medium">{challenge.prompt}</p>}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onAnswer?.(true, { challenge })}>
          Mark correct
        </Button>
        <Button
          variant="secondary"
          onClick={() => onAnswer?.(false, { challenge })}
        >
          Mark wrong
        </Button>
        <Button variant="ghost" onClick={() => onComplete?.()}>
          End round
        </Button>
      </div>
    </Card>
  );
}
