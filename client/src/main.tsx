import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext';

/**
 * Entry point for the React application.  Renders the App component
 * wrapped with necessary providers for websocket and game state.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </SocketProvider>
  </StrictMode>
);