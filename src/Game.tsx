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

    // Check 3D space diagonals - all 8 possible space diagonals through the cube
    // Main space diagonals (4 directions)
    for (let startLayer = 0; startLayer < size - 3; startLayer++) {
      for (let startRow = 0; startRow < size - 3; startRow++) {
        for (let startCol = 0; startCol < size - 3; startCol++) {
          // (layer, row, col) -> (layer+1, row+1, col+1) -> (layer+2, row+2, col+2) -> (layer+3, row+3, col+3)
          if (board[startLayer][startRow][startCol] !== '' &&
              board[startLayer][startRow][startCol] === board[startLayer + 1][startRow + 1][startCol + 1] &&
              board[startLayer + 1][startRow + 1][startCol + 1] === board[startLayer + 2][startRow + 2][startCol + 2] &&
              board[startLayer + 2][startRow + 2][startCol + 2] === board[startLayer + 3][startRow + 3][startCol + 3]) {
            return board[startLayer][startRow][startCol];
          }

          // (layer, row, size-1-col) -> (layer+1, row+1, size-2-col) -> (layer+2, row+2, size-3-col) -> (layer+3, row+3, size-4-col)
          if (board[startLayer][startRow][size - 1 - startCol] !== '' &&
              board[startLayer][startRow][size - 1 - startCol] === board[startLayer + 1][startRow + 1][size - 2 - startCol] &&
              board[startLayer + 1][startRow + 1][size - 2 - startCol] === board[startLayer + 2][startRow + 2][size - 3 - startCol] &&
              board[startLayer + 2][startRow + 2][size - 3 - startCol] === board[startLayer + 3][startRow + 3][size - 4 - startCol]) {
            return board[startLayer][startRow][size - 1 - startCol];
          }

          // (layer, size-1-row, col) -> (layer+1, size-2-row, col+1) -> (layer+2, size-3-row, col+2) -> (layer+3, size-4-row, col+3)
          if (board[startLayer][size - 1 - startRow][startCol] !== '' &&
              board[startLayer][size - 1 - startRow][startCol] === board[startLayer + 1][size - 2 - startRow][startCol + 1] &&
              board[startLayer + 1][size - 2 - startRow][startCol + 1] === board[startLayer + 2][size - 3 - startRow][startCol + 2] &&
              board[startLayer + 2][size - 3 - startRow][startCol + 2] === board[startLayer + 3][size - 4 - startRow][startCol + 3]) {
            return board[startLayer][size - 1 - startRow][startCol];
          }

          // (layer, size-1-row, size-1-col) -> (layer+1, size-2-row, size-2-col) -> (layer+2, size-3-row, size-3-col) -> (layer+3, size-4-row, size-4-col)
          if (board[startLayer][size - 1 - startRow][size - 1 - startCol] !== '' &&
              board[startLayer][size - 1 - startRow][size - 1 - startCol] === board[startLayer + 1][size - 2 - startRow][size - 2 - startCol] &&
              board[startLayer + 1][size - 2 - startRow][size - 2 - startCol] === board[startLayer + 2][size - 3 - startRow][size - 3 - startCol] &&
              board[startLayer + 2][size - 3 - startRow][size - 3 - startCol] === board[startLayer + 3][size - 4 - startRow][size - 4 - startCol]) {
            return board[startLayer][size - 1 - startRow][size - 1 - startCol];
          }
        }
      }
    }

    // Reverse space diagonals (4 directions) - starting from the opposite corner
    for (let startLayer = 3; startLayer < size; startLayer++) {
      for (let startRow = 3; startRow < size; startRow++) {
        for (let startCol = 3; startCol < size; startCol++) {
          // (layer, row, col) -> (layer-1, row-1, col-1) -> (layer-2, row-2, col-2) -> (layer-3, row-3, col-3)
          if (board[startLayer][startRow][startCol] !== '' &&
              board[startLayer][startRow][startCol] === board[startLayer - 1][startRow - 1][startCol - 1] &&
              board[startLayer - 1][startRow - 1][startCol - 1] === board[startLayer - 2][startRow - 2][startCol - 2] &&
              board[startLayer - 2][startRow - 2][startCol - 2] === board[startLayer - 3][startRow - 3][startCol - 3]) {
            return board[startLayer][startRow][startCol];
          }

          // (layer, row, size-1-col) -> (layer-1, row-1, size-2-col) -> (layer-2, row-2, size-3-col) -> (layer-3, row-3, size-4-col)
          if (board[startLayer][startRow][size - 1 - startCol] !== '' &&
              board[startLayer][startRow][size - 1 - startCol] === board[startLayer - 1][startRow - 1][size - 2 - startCol] &&
              board[startLayer - 1][startRow - 1][size - 2 - startCol] === board[startLayer - 2][startRow - 2][size - 3 - startCol] &&
              board[startLayer - 2][startRow - 2][size - 3 - startCol] === board[startLayer - 3][startRow - 3][size - 4 - startCol]) {
            return board[startLayer][startRow][size - 1 - startCol];
          }

          // (layer, size-1-row, col) -> (layer-1, size-2-row, col-1) -> (layer-2, size-3-row, col-2) -> (layer-3, size-4-row, col-3)
          if (board[startLayer][size - 1 - startRow][startCol] !== '' &&
              board[startLayer][size - 1 - startRow][startCol] === board[startLayer - 1][size - 2 - startRow][startCol - 1] &&
              board[startLayer - 1][size - 2 - startRow][startCol - 1] === board[startLayer - 2][size - 3 - startRow][startCol - 2] &&
              board[startLayer - 2][size - 3 - startRow][startCol - 2] === board[startLayer - 3][size - 4 - startRow][startCol - 3]) {
            return board[startLayer][size - 1 - startRow][startCol];
          }

          // (layer, size-1-row, size-1-col) -> (layer-1, size-2-row, size-2-col) -> (layer-2, size-3-row, size-3-col) -> (layer-3, size-4-row, size-4-col)
          if (board[startLayer][size - 1 - startRow][size - 1 - startCol] !== '' &&
              board[startLayer][size - 1 - startRow][size - 1 - startCol] === board[startLayer - 1][size - 2 - startRow][size - 2 - startCol] &&
              board[startLayer - 1][size - 2 - startRow][size - 2 - startCol] === board[startLayer - 2][size - 3 - startRow][size - 3 - startCol] &&
              board[startLayer - 2][size - 3 - startRow][size - 3 - startCol] === board[startLayer - 3][size - 4 - startRow][size - 4 - startCol]) {
            return board[startLayer][size - 1 - startRow][size - 1 - startCol];
          }
        }
      }
    }

    // Check 2D diagonals in XZ planes (constant Y, vertical slices through layers and columns)
    // These are diagonals in planes where the Y-coordinate is constant
    for (let y = 0; y < size; y++) {
      for (let start = 0; start < size - 3; start++) {
        // Main diagonal in XZ plane: (start,y,start) -> (start+1,y,start+1) -> (start+2,y,start+2) -> (start+3,y,start+3)
        if (board[start][y][start] !== '' &&
            board[start][y][start] === board[start + 1][y][start + 1] &&
            board[start + 1][y][start + 1] === board[start + 2][y][start + 2] &&
            board[start + 2][y][start + 2] === board[start + 3][y][start + 3]) {
          return board[start][y][start];
        }
        // Anti-diagonal in XZ plane: (start,y,size-start-1) -> (start+1,y,size-start-2) -> (start+2,y,size-start-3) -> (start+3,y,size-start-4)
        if (board[start][y][size - start - 1] !== '' &&
            board[start][y][size - start - 1] === board[start + 1][y][size - start - 2] &&
            board[start + 1][y][size - start - 2] === board[start + 2][y][size - start - 3] &&
            board[start + 2][y][size - start - 3] === board[start + 3][y][size - start - 4]) {
          return board[start][y][size - start - 1];
        }
      }
    }

    // Check 2D diagonals in YZ planes (constant X, vertical slices through rows and columns)
    // These are diagonals in planes where the X-coordinate is constant
    for (let x = 0; x < size; x++) {
      for (let start = 0; start < size - 3; start++) {
        // Main diagonal in YZ plane: (x,start,start) -> (x,start+1,start+1) -> (x,start+2,start+2) -> (x,start+3,start+3)
        if (board[x][start][start] !== '' &&
            board[x][start][start] === board[x][start + 1][start + 1] &&
            board[x][start + 1][start + 1] === board[x][start + 2][start + 2] &&
            board[x][start + 2][start + 2] === board[x][start + 3][start + 3]) {
          return board[x][start][start];
        }
        // Anti-diagonal in YZ plane: (x,start,size-start-1) -> (x,start+1,size-start-2) -> (x,start+2,size-start-3) -> (x,start+3,size-start-4)
        if (board[x][start][size - start - 1] !== '' &&
            board[x][start][size - start - 1] === board[x][start + 1][size - start - 2] &&
            board[x][start + 1][size - start - 2] === board[x][start + 2][size - start - 3] &&
            board[x][start + 2][size - start - 3] === board[x][start + 3][size - start - 4]) {
          return board[x][start][size - start - 1];
        }
      }
    }

    // Check 2D diagonals in XY planes (constant Z, horizontal slices through layers and rows)
    // These are diagonals in planes where the Z-coordinate is constant
    for (let z = 0; z < size; z++) {
      for (let start = 0; start < size - 3; start++) {
        // Main diagonal in XY plane: (start,start,z) -> (start+1,start+1,z) -> (start+2,start+2,z) -> (start+3,start+3,z)
        if (board[start][start][z] !== '' &&
            board[start][start][z] === board[start + 1][start + 1][z] &&
            board[start + 1][start + 1][z] === board[start + 2][start + 2][z] &&
            board[start + 2][start + 2][z] === board[start + 3][start + 3][z]) {
          return board[start][start][z];
        }
        // Anti-diagonal in XY plane: (start,size-start-1,z) -> (start+1,size-start-2,z) -> (start+2,size-start-3,z) -> (start+3,size-start-4,z)
        if (board[start][size - start - 1][z] !== '' &&
            board[start][size - start - 1][z] === board[start + 1][size - start - 2][z] &&
            board[start + 1][size - start - 2][z] === board[start + 2][size - start - 3][z] &&
            board[start + 2][size - start - 3][z] === board[start + 3][size - start - 4][z]) {
          return board[start][size - start - 1][z];
        }
      }
    }

    // Check additional 3D diagonal patterns that weren't covered above
    // These are diagonals that go in different directions in 3D space

    // Diagonals with mixed directions: (+1, +1, -1), (+1, -1, +1), (-1, +1, +1), etc.
    for (let layer = 0; layer < size; layer++) {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          // Direction: (+1, +1, -1) - layer increases, row increases, col decreases
          if (layer < size - 3 && row < size - 3 && col >= 3 &&
              board[layer][row][col] !== '' &&
              board[layer][row][col] === board[layer + 1][row + 1][col - 1] &&
              board[layer + 1][row + 1][col - 1] === board[layer + 2][row + 2][col - 2] &&
              board[layer + 2][row + 2][col - 2] === board[layer + 3][row + 3][col - 3]) {
            return board[layer][row][col];
          }

          // Direction: (+1, -1, +1) - layer increases, row decreases, col increases
          if (layer < size - 3 && row >= 3 && col < size - 3 &&
              board[layer][row][col] !== '' &&
              board[layer][row][col] === board[layer + 1][row - 1][col + 1] &&
              board[layer + 1][row - 1][col + 1] === board[layer + 2][row - 2][col + 2] &&
              board[layer + 2][row - 2][col + 2] === board[layer + 3][row - 3][col + 3]) {
            return board[layer][row][col];
          }

          // Direction: (-1, +1, +1) - layer decreases, row increases, col increases
          if (layer >= 3 && row < size - 3 && col < size - 3 &&
              board[layer][row][col] !== '' &&
              board[layer][row][col] === board[layer - 1][row + 1][col + 1] &&
              board[layer - 1][row + 1][col + 1] === board[layer - 2][row + 2][col + 2] &&
              board[layer - 2][row + 2][col + 2] === board[layer - 3][row + 3][col + 3]) {
            return board[layer][row][col];
          }

          // Direction: (+1, -1, -1) - layer increases, row decreases, col decreases
          if (layer < size - 3 && row >= 3 && col >= 3 &&
              board[layer][row][col] !== '' &&
              board[layer][row][col] === board[layer + 1][row - 1][col - 1] &&
              board[layer + 1][row - 1][col - 1] === board[layer + 2][row - 2][col - 2] &&
              board[layer + 2][row - 2][col - 2] === board[layer + 3][row - 3][col - 3]) {
            return board[layer][row][col];
          }

          // Direction: (-1, +1, -1) - layer decreases, row increases, col decreases
          if (layer >= 3 && row < size - 3 && col >= 3 &&
              board[layer][row][col] !== '' &&
              board[layer][row][col] === board[layer - 1][row + 1][col - 1] &&
              board[layer - 1][row + 1][col - 1] === board[layer - 2][row + 2][col - 2] &&
              board[layer - 2][row + 2][col - 2] === board[layer - 3][row + 3][col - 3]) {
            return board[layer][row][col];
          }

          // Direction: (-1, -1, +1) - layer decreases, row decreases, col increases
          if (layer >= 3 && row >= 3 && col < size - 3 &&
              board[layer][row][col] !== '' &&
              board[layer][row][col] === board[layer - 1][row - 1][col + 1] &&
              board[layer - 1][row - 1][col + 1] === board[layer - 2][row - 2][col + 2] &&
              board[layer - 2][row - 2][col + 2] === board[layer - 3][row - 3][col + 3]) {
            return board[layer][row][col];
          }

          // Direction: (-1, -1, -1) - all coordinates decrease
          if (layer >= 3 && row >= 3 && col >= 3 &&
              board[layer][row][col] !== '' &&
              board[layer][row][col] === board[layer - 1][row - 1][col - 1] &&
              board[layer - 1][row - 1][col - 1] === board[layer - 2][row - 2][col - 2] &&
              board[layer - 2][row - 2][col - 2] === board[layer - 3][row - 3][col - 3]) {
            return board[layer][row][col];
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
