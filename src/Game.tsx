import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Board from './Board';

const Game: React.FC = () => {
  const [board, setBoard] = useState<string[][][]>(Array(4).fill(null).map(() => Array(4).fill(null).map(() => Array(4).fill(''))));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const calculateWinner = (board: string[][][]): string | null => {
    const size = 4;
    
    // Check for winning combinations in 3D
    for (let layer = 0; layer < size; layer++) {
      // Check rows in the current layer
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size - 3; col++) {
          if (board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer][row][col + 1] && 
              board[layer][row][col + 1] === board[layer][row][col + 2] && 
              board[layer][row][col + 2] === board[layer][row][col + 3]) {
            return board[layer][row][col];
          }
        }
      }
      
      // Check columns in the current layer
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size - 3; row++) {
          if (board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer][row + 1][col] && 
              board[layer][row + 1][col] === board[layer][row + 2][col] && 
              board[layer][row + 2][col] === board[layer][row + 3][col]) {
            return board[layer][row][col];
          }
        }
      }
    }

    // Check pillars (vertical across layers)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        for (let layer = 0; layer < size - 3; layer++) {
          if (board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer + 1][row][col] && 
              board[layer + 1][row][col] === board[layer + 2][row][col] && 
              board[layer + 2][row][col] === board[layer + 3][row][col]) {
            return board[layer][row][col];
          }
        }
      }
    }

    // Check diagonals in each layer (main diagonal)
    for (let layer = 0; layer < size; layer++) {
      for (let start = 0; start < size - 3; start++) {
        if (board[layer][start][start] !== '' && 
            board[layer][start][start] === board[layer][start + 1][start + 1] && 
            board[layer][start + 1][start + 1] === board[layer][start + 2][start + 2] && 
            board[layer][start + 2][start + 2] === board[layer][start + 3][start + 3]) {
          return board[layer][start][start];
        }
      }
    }

    // Check diagonals in each layer (anti-diagonal)
    for (let layer = 0; layer < size; layer++) {
      for (let start = 0; start < size - 3; start++) {
        if (board[layer][start][size - 1 - start] !== '' && 
            board[layer][start][size - 1 - start] === board[layer][start + 1][size - 2 - start] && 
            board[layer][start + 1][size - 2 - start] === board[layer][start + 2][size - 3 - start] && 
            board[layer][start + 2][size - 3 - start] === board[layer][start + 3][size - 4 - start]) {
          return board[layer][start][size - 1 - start];
        }
      }
    }

    // Check 3D diagonals - main 3D diagonal directions
    // From (0,0,0) to (3,3,3) - various starting positions
    for (let layer = 0; layer < size - 3; layer++) {
      for (let row = 0; row < size - 3; row++) {
        for (let col = 0; col < size - 3; col++) {
          // Main 3D diagonal (layer, row, col) -> (layer+1, row+1, col+1) -> (layer+2, row+2, col+2) -> (layer+3, row+3, col+3)
          if (board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer + 1][row + 1][col + 1] && 
              board[layer + 1][row + 1][col + 1] === board[layer + 2][row + 2][col + 2] && 
              board[layer + 2][row + 2][col + 2] === board[layer + 3][row + 3][col + 3]) {
            return board[layer][row][col];
          }
          
          // 3D diagonal (layer, row, size-1-col) -> (layer+1, row+1, size-2-col) -> (layer+2, row+2, size-3-col) -> (layer+3, row+3, size-4-col)
          if (board[layer][row][size - 1 - col] !== '' && 
              board[layer][row][size - 1 - col] === board[layer + 1][row + 1][size - 2 - col] && 
              board[layer + 1][row + 1][size - 2 - col] === board[layer + 2][row + 2][size - 3 - col] && 
              board[layer + 2][row + 2][size - 3 - col] === board[layer + 3][row + 3][size - 4 - col]) {
            return board[layer][row][size - 1 - col];
          }
          
          // 3D diagonal (layer, size-1-row, col) -> (layer+1, size-2-row, col+1) -> (layer+2, size-3-row, col+2) -> (layer+3, size-4-row, col+3)
          if (board[layer][size - 1 - row][col] !== '' && 
              board[layer][size - 1 - row][col] === board[layer + 1][size - 2 - row][col + 1] && 
              board[layer + 1][size - 2 - row][col + 1] === board[layer + 2][size - 3 - row][col + 2] && 
              board[layer + 2][size - 3 - row][col + 2] === board[layer + 3][size - 4 - row][col + 3]) {
            return board[layer][size - 1 - row][col];
          }
          
          // 3D diagonal (layer, size-1-row, size-1-col) -> (layer+1, size-2-row, size-2-col) -> (layer+2, size-3-row, size-3-col) -> (layer+3, size-4-row, size-4-col)
          if (board[layer][size - 1 - row][size - 1 - col] !== '' && 
              board[layer][size - 1 - row][size - 1 - col] === board[layer + 1][size - 2 - row][size - 2 - col] && 
              board[layer + 1][size - 2 - row][size - 2 - col] === board[layer + 2][size - 3 - row][size - 3 - col] && 
              board[layer + 2][size - 3 - row][size - 3 - col] === board[layer + 3][size - 4 - row][size - 4 - col]) {
            return board[layer][size - 1 - row][size - 1 - col];
          }
        }
      }
    }

    return null;
  };

  const handleClick = (layer: number, row: number, col: number) => {
    if (gameOver || board[layer][row][col] !== '') return;

    const newBoard = [...board];
    newBoard[layer][row] = [...newBoard[layer][row]];
    newBoard[layer][row][col] = currentPlayer;
    setBoard(newBoard);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
    } else if (newBoard.flat(2).every(cell => cell !== '')) {
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(4).fill(null).map(() => Array(4).fill(null).map(() => Array(4).fill(''))));
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>3D Tic Tac Toe</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
          <Board board={board} onClick={handleClick} currentPlayer={currentPlayer} />
        </Canvas>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Current Player: {currentPlayer}</h2>
        {winner && <h2>Winner: {winner}</h2>}
        {gameOver && !winner && <h2>It's a Draw!</h2>}
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
};

export default Game;
