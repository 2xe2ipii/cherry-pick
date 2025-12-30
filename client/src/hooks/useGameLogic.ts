import { useGameContext } from '../context/GameContext';
import { useSocket } from '../context/SocketContext';

/**
 * Hook that consolidates game state and socket connectivity status.
 *
 * This provides a simple API for pages like the lobby and game room
 * to access the current room, any error messages, whether the
 * websocket connection is active, and a set of actions that emit
 * socket events.  It merely re-exports values from the GameContext
 * and SocketContext.
 */
export const useGameLogic = () => {
  const { isConnected } = useSocket();
  const { room, error, actions } = useGameContext();

  return {
    room,
    error,
    isConnected,
    actions
  };
};