// TitleScreen (INF-4 stub) — flow state TITLE. Built out in UI-1.
import { Button } from '../components';
import { useFlow } from '../state/flowContext.js';
import { APP_NAME } from '../appConfig.js';
import ScreenStub from './ScreenStub.jsx';

export default function TitleScreen() {
  const { startNew, continueGame, openProfile } = useFlow();
  return (
    <ScreenStub title={APP_NAME} subtitle="Title screen (UI-1)">
      <Button onClick={startNew}>New Game</Button>
      <Button variant="secondary" onClick={continueGame}>
        Continue
      </Button>
      <Button variant="ghost" onClick={openProfile}>
        Profile
      </Button>
    </ScreenStub>
  );
}
