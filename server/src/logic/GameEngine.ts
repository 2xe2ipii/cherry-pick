import { Room, Player, RoundResult } from '../types';

export class GameEngine {
  
  /**
   * Generates moves for bots based on their personality
   */
  public static generateBotGuesses(room: Room): Record<string, number> {
    const botGuesses: Record<string, number> = {};

    room.players.forEach(p => {
      if (p.isBot) {
        // In 1v1, we usually have specific bot personas. 
        // For now, let's randomize them slightly to keep it unpredictable.
        
        // 50% chance to be "Sour Grape" (Low number: 0-20)
        // 50% chance to be "Coconut" (Random: 0-100)
        const isSourGrape = Math.random() > 0.5;
        
        if (isSourGrape) {
          botGuesses[p.id] = Math.floor(Math.random() * 21);
        } else {
          botGuesses[p.id] = Math.floor(Math.random() * 101);
        }
      }
    });

    return botGuesses;
  }

  /**
   * The Core Game Loop: Average * 0.8 vs Rotten Zero
   */
  public static calculateRound(room: Room, playerInputs: Record<string, number>): RoundResult {
    // 1. Merge human inputs with bot inputs
    const allInputs = { ...playerInputs, ...this.generateBotGuesses(room) };
    const values = Object.values(allInputs);

    // 2. Check "Rotten Zero" Rule
    const hasZero = values.includes(0);
    let target = 0;
    let average = 0;

    if (hasZero) {
      target = 100; // The Twist
      average = 0;  // Irrelevant in this case
    } else {
      // Standard Logic
      const sum = values.reduce((a, b) => a + b, 0);
      average = sum / values.length;
      target = Math.round(average * 0.8);
    }

    // 3. Find Winner(s)
    let minDiff = 101;
    let winnerId: string | null = null;
    // Note: If multiple people tie, we currently just pick the last one checked. 
    // In a real prod game, you might handle ties by giving it to all of them.
    
    Object.entries(allInputs).forEach(([id, val]) => {
      const diff = Math.abs(val - target);
      if (diff < minDiff) {
        minDiff = diff;
        winnerId = id;
      }
    });

    // 4. Calculate Eliminations (Everyone except winner)
    const eliminatedIds: string[] = [];
    room.players.forEach(p => {
      if (p.id !== winnerId) {
        p.lives -= 1;
        eliminatedIds.push(p.id);
      }
      // Update their current guess in state for display
      p.currentGuess = allInputs[p.id]; 
    });

    return {
      targetNumber: target,
      average,
      winnerId,
      eliminatedIds,
      isRottenZero: hasZero,
      allGuesses: allInputs
    };
  }
}