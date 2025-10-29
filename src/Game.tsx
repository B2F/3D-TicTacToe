import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Board from './Board';
import AIPlayer from './AIPlayer';
import { Difficulty, BoardState } from './types';

const Game: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(4).fill(null).map(() => Array(4).fill(null).map(() => Array(4).fill(''))));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  
  // Computer player state
  const [gameMode, setGameMode] = useState<'human' | 'computer'>('human'); // 'human' for human vs human, 'computer' for human vs computer
  const [computerPlayer, setComputerPlayer] = useState<'X' | 'O'>('O'); // Computer plays as O by default
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const calculateWinner = (board: BoardState): string | null => {
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

    const handleAIMove = (x: number, y: number, z: number) => {
    if (gameOver || board[x][y][z] !== '') return;

    const newBoard = [...board];
    newBoard[x][y] = [...newBoard[x][y]];
    newBoard[x][y][z] = currentPlayer;
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

  const handleClick = (layer: number, row: number, col: number) => {
    if (gameOver || board[layer][row][col] !== '' || isComputerThinking) return;

    // Only allow human player to make moves in computer mode
    if (gameMode === 'computer' && currentPlayer === computerPlayer) {
      return; // Computer's turn, human can't make a move
    }

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
      
      {/* Game mode and difficulty controls */}
      <div style={{ textAlign: 'center', marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
        <div>
          <label>
            <input
              type="radio"
              checked={gameMode === 'human'}
              onChange={() => setGameMode('human')}
            />
            Human vs Human
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              checked={gameMode === 'computer'}
              onChange={() => setGameMode('computer')}
            />
            Human vs Computer
          </label>
        </div>
        
        {gameMode === 'computer' && (
          <div style={{ marginTop: '10px' }}>
            <label>
              Computer plays as: 
              <select 
                value={computerPlayer} 
                onChange={(e) => setComputerPlayer(e.target.value as 'X' | 'O')}
                style={{ marginLeft: '5px' }}
              >
                <option value="X">X</option>
                <option value="O">O</option>
              </select>
            </label>
            
            <label style={{ marginLeft: '15px' }}>
              Difficulty: 
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                style={{ marginLeft: '5px' }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
          <Board board={board} onClick={handleClick} currentPlayer={currentPlayer} />
        </Canvas>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Current Player: {currentPlayer}</h2>
        {winner && <h2>Winner: {winner}</h2>}
        {gameOver && !winner && <h2>It's a Draw!</h2>}
        {isComputerThinking && <h3>Computer is thinking...</h3>}
        <button onClick={resetGame}>Reset Game</button>
      </div>
      
      {/* AI Player component - handles computer moves when it's computer's turn */}
      {gameMode === 'computer' && (
        <AIPlayer
          board={board}
          currentPlayer={currentPlayer}
          isAITurn={gameMode === 'computer' && currentPlayer === computerPlayer && !gameOver}
          difficulty={difficulty}
          onAIMove={handleAIMove}
          isGameActive={!gameOver}
          setIsComputerThinking={setIsComputerThinking}
        />
      )}
    </div>
  );
};

export default Game;
