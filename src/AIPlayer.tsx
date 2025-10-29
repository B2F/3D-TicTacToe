import React, { useEffect } from 'react';
import { BoardState, Player, Difficulty } from './types';
import { getBestMove } from './AI';

interface AIPlayerProps {
  board: BoardState;
 currentPlayer: Player;
 isAITurn: boolean;
  difficulty: Difficulty;
  onAIMove: (x: number, y: number, z: number) => void;
  isGameActive: boolean;
  setIsComputerThinking: (thinking: boolean) => void;
}

const AIPlayer: React.FC<AIPlayerProps> = ({
  board,
  currentPlayer,
  isAITurn,
  difficulty,
  onAIMove,
  isGameActive,
  setIsComputerThinking
}) => {
  useEffect(() => {
    if (isAITurn && isGameActive) {
      // Set computer thinking state to true
      setIsComputerThinking(true);
      
      // Add a small delay to make the AI move feel more natural
      const timer = setTimeout(() => {
        try {
          const [x, y, z] = getBestMove(board, currentPlayer, difficulty);
          onAIMove(x, y, z);
        } catch (error) {
          console.error('Error getting AI move:', error);
          // Fallback: make a random move if AI fails
          const emptyCells: [number, number, number][] = [];
          for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
              for (let z = 0; z < 4; z++) {
                if (board[x][y][z] === '') {
                  emptyCells.push([x, y, z]);
                }
              }
            }
          }
          if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const [randX, randY, randZ] = emptyCells[randomIndex];
            onAIMove(randX, randY, randZ);
          }
        } finally {
          // Set computer thinking state to false after move
          setIsComputerThinking(false);
        }
      }, 500); // 500ms delay for more natural feel

      // Cleanup function to reset thinking state if component unmounts
      return () => {
        clearTimeout(timer);
        setIsComputerThinking(false);
      };
    } else {
      // If it's not AI's turn, ensure thinking state is false
      setIsComputerThinking(false);
    }
  }, [isAITurn, board, currentPlayer, difficulty, onAIMove, isGameActive, setIsComputerThinking]);

  return null; // AIPlayer is a logic component, no UI to render
};

export default AIPlayer;
