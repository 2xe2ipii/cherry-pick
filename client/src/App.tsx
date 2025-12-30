import { useGameLogic } from './hooks/useGameLogic';
import { Lobby } from './pages/Lobby';
import { GameRoom } from './pages/GameRoom';

function App() {
  const { room, isConnected } = useGameLogic();

  // 1. Loading State (Connecting to Server)
  if (!isConnected) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-orange-50 gap-4">
        <h1 className="text-4xl font-black text-rose-500 animate-bounce">Cherry Pick 🍒</h1>
        <div className="text-rose-400 font-bold animate-pulse">
          Connecting to server...
        </div>
      </div>
    );
  }

  // 2. Routing Logic
  // If we have a room object, check its status to decide what to show.
  if (room) {
    // If the game is actively playing (or showing results/game over), show the Game Room
    if (room.status === 'PLAYING' || room.status === 'REVEAL' || room.status === 'GAME_OVER') {
      return <GameRoom room={room} />;
    }

    // If status is 'LOBBY', the Lobby component handles the "Waiting Room" view
    // so we fall through to the return below, or we could explicitly return <Lobby /> here.
    // However, the Lobby component is smart enough to show the "Waiting" view if 'room' exists.
    return <Lobby />;
  }

  // 3. Default: Show the Login/Create Room Screen
  return <Lobby />;
}

export default App;