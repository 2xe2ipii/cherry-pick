import { useGameContext } from '../context/GameContext';
import { useSocket } from '../context/SocketContext';

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