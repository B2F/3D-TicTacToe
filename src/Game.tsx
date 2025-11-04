import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Board from './Board';
import AIPlayer from './AIPlayer';
import { Difficulty, BoardState } from './types';
import { checkWin } from './AI';

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
    if (checkWin(board, 'X')) return 'X';
    if (checkWin(board, 'O')) return 'O';
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
