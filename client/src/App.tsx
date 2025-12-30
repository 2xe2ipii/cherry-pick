import { useGameLogic } from './hooks/useGameLogic';
import { Lobby } from './pages/Lobby';
import { GameRoom } from './pages/GameRoom';

function App() {
  const { room, isConnected } = useGameLogic();

  if (!isConnected) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-orange-50 gap-4">
        <h1 className="text-4xl font-black text-rose-500 animate-bounce">Cherry Pick 🍒</h1>
        <div className="text-rose-400 font-bold animate-pulse">Connecting...</div>
      </div>
    );
  }

  // Debugging: Check console to see if status changes to PLAYING
  if (room) {
    console.log('Current Room Status:', room.status);
    
    if (room.status === 'PLAYING' || room.status === 'REVEAL' || room.status === 'GAME_OVER') {
      return <GameRoom room={room} />;
    }
    
    return <Lobby />;
  }

  return <Lobby />;
}

export default App;