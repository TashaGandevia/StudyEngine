// Application entry point.
// Mounts the React tree into the #root node defined in index.html and pulls in
// the global Tailwind stylesheet. StrictMode surfaces potential problems in dev.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import MotionProvider from './components/MotionProvider.jsx';
import './index.css';

// MotionProvider applies the app-wide reduced-motion guard (INF-3). Once M1
// game state exists, settings.reducedMotion will be passed as `forceReduced`.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>
);
