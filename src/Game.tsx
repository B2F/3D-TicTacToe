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

    // Check diagonals in XZ planes (constant y, vertical slices)
    // These are the diagonals in planes where y-coordinate is constant
    for (let y = 0; y < size; y++) {
      for (let start = 0; start < size - 3; start++) {
        // Main diagonal: (start,y,start) -> (start+1,y,start+1) -> (start+2,y,start+2) -> (start+3,y,start+3)
        if (board[start][y][start] !== '' &&
            board[start][y][start] === board[start + 1][y][start + 1] &&
            board[start + 1][y][start + 1] === board[start + 2][y][start + 2] &&
            board[start + 2][y][start + 2] === board[start + 3][y][start + 3]) {
          return board[start][y][start];
        }
        // Anti-diagonal: (start,y,size-start-1) -> (start+1,y,size-start-2) -> (start+2,y,size-start-3) -> (start+3,y,size-start-4)
        if (board[start][y][size - start - 1] !== '' &&
            board[start][y][size - start - 1] === board[start + 1][y][size - start - 2] &&
            board[start + 1][y][size - start - 2] === board[start + 2][y][size - start - 3] &&
            board[start + 2][y][size - start - 3] === board[start + 3][y][size - start - 4]) {
          return board[start][y][size - start - 1];
        }
      }
    }

    // Check diagonals in YZ planes (constant x, vertical slices)
    // These are the diagonals in planes where x-coordinate is constant
    for (let x = 0; x < size; x++) {
      for (let start = 0; start < size - 3; start++) {
        // Main diagonal: (x,start,start) -> (x,start+1,start+1) -> (x,start+2,start+2) -> (x,start+3,start+3)
        if (board[x][start][start] !== '' &&
            board[x][start][start] === board[x][start + 1][start + 1] &&
            board[x][start + 1][start + 1] === board[x][start + 2][start + 2] &&
            board[x][start + 2][start + 2] === board[x][start + 3][start + 3]) {
          return board[x][start][start];
        }
        // Anti-diagonal: (x,start,size-start-1) -> (x,start+1,size-start-2) -> (x,start+2,size-start-3) -> (x,start+3,size-start-4)
        if (board[x][start][size - start - 1] !== '' &&
            board[x][start][size - start - 1] === board[x][start + 1][size - start - 2] &&
            board[x][start + 1][size - start - 2] === board[x][start + 2][size - start - 3] &&
            board[x][start + 2][size - start - 3] === board[x][start + 3][size - start - 4]) {
          return board[x][start][size - start - 1];
        }
      }
    }

    // Check diagonals in XZ planes (constant y, horizontal slices)
    // These are the diagonals in planes where y-coordinate is constant
    for (let y = 0; y < size; y++) {
      for (let start = 0; start < size - 3; start++) {
        // Main diagonal: (start,y,start) -> (start+1,y,start+1) -> (start+2,y,start+2) -> (start+3,y,start+3)
        if (board[start][y][start] !== '' &&
            board[start][y][start] === board[start + 1][y][start + 1] &&
            board[start + 1][y][start + 1] === board[start + 2][y][start + 2] &&
            board[start + 2][y][start + 2] === board[start + 3][y][start + 3]) {
          return board[start][y][start];
        }
        // Anti-diagonal: (start,y,size-start-1) -> (start+1,y,size-start-2) -> (start+2,y,size-start-3) -> (start+3,y,size-start-4)
        if (board[start][y][size - start - 1] !== '' &&
            board[start][y][size - start - 1] === board[start + 1][y][size - start - 2] &&
            board[start + 1][y][size - start - 2] === board[start + 2][y][size - start - 3] &&
            board[start + 2][y][size - start - 3] === board[start + 3][y][size - start - 4]) {
          return board[start][y][size - start - 1];
        }
      }
    }

    // Check diagonals in YZ planes (constant x, vertical slices)
    // These are the diagonals in planes where x-coordinate is constant
    for (let x = 0; x < size; x++) {
      for (let start = 0; start < size - 3; start++) {
        // Main diagonal: (x,start,start) -> (x,start+1,start+1) -> (x,start+2,start+2) -> (x,start+3,start+3)
        if (board[x][start][start] !== '' &&
            board[x][start][start] === board[x][start + 1][start + 1] &&
            board[x][start + 1][start + 1] === board[x][start + 2][start + 2] &&
            board[x][start + 2][start + 2] === board[x][start + 3][start + 3]) {
          return board[x][start][start];
        }
        // Anti-diagonal: (x,start,size-start-1) -> (x,start+1,size-start-2) -> (x,start+2,size-start-3) -> (x,start+3,size-start-4)
        if (board[x][start][size - start - 1] !== '' &&
            board[x][start][size - start - 1] === board[x][start + 1][size - start - 2] &&
            board[x][start + 1][size - start - 2] === board[x][start + 2][size - start - 3] &&
            board[x][start + 2][size - start - 3] === board[x][start + 3][size - start - 4]) {
          return board[x][start][size - start - 1];
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

    // Check additional 3D diagonal patterns (stair-like patterns)
    // These are other diagonal patterns that go through the cube in different directions
    
    // Diagonals with different step patterns
    for (let layer = 0; layer < size - 3; layer++) {
      for (let row = 0; row < size - 3; row++) {
        for (let col = 0; col < size - 3; col++) {
          // Diagonal with pattern: (+1, +1, -1) direction (if we consider wrapping or different patterns)
          // Actually, let me think about other 3D diagonal directions that might exist
          
          // Pattern: (+1, -1, +1) - layer+1, row-1, col+1 (but row-1 needs to start higher)
          if (layer < size - 3 && row >= 3 && col < size - 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer + 1][row - 1][col + 1] && 
              board[layer + 1][row - 1][col + 1] === board[layer + 2][row - 2][col + 2] && 
              board[layer + 2][row - 2][col + 2] === board[layer + 3][row - 3][col + 3]) {
            return board[layer][row][col];
          }
          
          // Pattern: (-1, +1, +1) - but layer-1 needs to start higher
          if (layer >= 3 && row < size - 3 && col < size - 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer - 1][row + 1][col + 1] && 
              board[layer - 1][row + 1][col + 1] === board[layer - 2][row + 2][col + 2] && 
              board[layer - 2][row + 2][col + 2] === board[layer - 3][row + 3][col + 3]) {
            return board[layer][row][col];
          }
          
          // Pattern: (+1, -1, -1)
          if (layer < size - 3 && row >= 3 && col >= 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer + 1][row - 1][col - 1] && 
              board[layer + 1][row - 1][col - 1] === board[layer + 2][row - 2][col - 2] && 
              board[layer + 2][row - 2][col - 2] === board[layer + 3][row - 3][col - 3]) {
            return board[layer][row][col];
          }
        }
      }
    }

    // Additional 3D diagonals starting from different positions
    // Check for diagonals going in reverse directions more systematically
    for (let layer = 3; layer < size; layer++) {
      for (let row = 0; row < size - 3; row++) {
        for (let col = 0; col < size - 3; col++) {
          // Pattern: (-1, +1, +1) starting from higher layer
          if (board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer - 1][row + 1][col + 1] && 
              board[layer - 1][row + 1][col + 1] === board[layer - 2][row + 2][col + 2] && 
              board[layer - 2][row + 2][col + 2] === board[layer - 3][row + 3][col + 3]) {
            return board[layer][row][col];
          }
        }
      }
    }

    // More comprehensive 3D diagonal patterns (inner stair-like patterns)
    // Cover all possible 3D diagonal directions
    for (let layer = 0; layer < size; layer++) {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          // Check all possible 3D diagonal directions from each position
          
          // Direction: (+1, +1, -1) - but need to ensure bounds
          if (layer < size - 3 && row < size - 3 && col >= 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer + 1][row + 1][col - 1] && 
              board[layer + 1][row + 1][col - 1] === board[layer + 2][row + 2][col - 2] && 
              board[layer + 2][row + 2][col - 2] === board[layer + 3][row + 3][col - 3]) {
            return board[layer][row][col];
          }
          
          // Direction: (+1, -1, +1) - already covered but let me ensure all bounds
          if (layer < size - 3 && row >= 3 && col < size - 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer + 1][row - 1][col + 1] && 
              board[layer + 1][row - 1][col + 1] === board[layer + 2][row - 2][col + 2] && 
              board[layer + 2][row - 2][col + 2] === board[layer + 3][row - 3][col + 3]) {
            return board[layer][row][col];
          }
          
          // Direction: (-1, +1, -1) 
          if (layer >= 3 && row < size - 3 && col >= 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer - 1][row + 1][col - 1] && 
              board[layer - 1][row + 1][col - 1] === board[layer - 2][row + 2][col - 2] && 
              board[layer - 2][row + 2][col - 2] === board[layer - 3][row + 3][col - 3]) {
            return board[layer][row][col];
          }
          
          // Direction: (-1, -1, +1)
          if (layer >= 3 && row >= 3 && col < size - 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer - 1][row - 1][col + 1] && 
              board[layer - 1][row - 1][col + 1] === board[layer - 2][row - 2][col + 2] && 
              board[layer - 2][row - 2][col + 2] === board[layer - 3][row - 3][col + 3]) {
            return board[layer][row][col];
          }
          
          // Direction: (+1, -1, -1) - already covered
          if (layer < size - 3 && row >= 3 && col >= 3 &&
              board[layer][row][col] !== '' && 
              board[layer][row][col] === board[layer + 1][row - 1][col - 1] && 
              board[layer + 1][row - 1][col - 1] === board[layer + 2][row - 2][col - 2] && 
              board[layer + 2][row - 2][col - 2] === board[layer + 3][row - 3][col - 3]) {
            return board[layer][row][col];
          }
          
          // Direction: (-1, -1, -1)
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

    // Check diagonals on the outer faces of the cube
    // These are the "surface diagonals" that go across the faces of the 4x4x4 cube
    
    // Front face (z = 0): diagonals across x and y axes
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal (0,0,0) -> (1,1,0) -> (2,2,0) -> (3,3,0)
      if (board[start][start][0] !== '' && 
          board[start][start][0] === board[start + 1][start + 1][0] && 
          board[start + 1][start + 1][0] === board[start + 2][start + 2][0] && 
          board[start + 2][start + 2][0] === board[start + 3][start + 3][0]) {
        return board[start][start][0];
      }
      // Anti-diagonal (3,0,0) -> (2,1,0) -> (1,2,0) -> (0,3,0)
      if (board[size - 1 - start][start][0] !== '' && 
          board[size - 1 - start][start][0] === board[size - 2 - start][start + 1][0] && 
          board[size - 2 - start][start + 1][0] === board[size - 3 - start][start + 2][0] && 
          board[size - 3 - start][start + 2][0] === board[size - 4 - start][start + 3][0]) {
        return board[size - 1 - start][start][0];
      }
    }

    // Back face (z = 3): diagonals across x and y axes
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal (0,0,3) -> (1,1,3) -> (2,2,3) -> (3,3,3)
      if (board[start][start][size - 1] !== '' && 
          board[start][start][size - 1] === board[start + 1][start + 1][size - 1] && 
          board[start + 1][start + 1][size - 1] === board[start + 2][start + 2][size - 1] && 
          board[start + 2][start + 2][size - 1] === board[start + 3][start + 3][size - 1]) {
        return board[start][start][size - 1];
      }
      // Anti-diagonal (3,0,3) -> (2,1,3) -> (1,2,3) -> (0,3,3)
      if (board[size - 1 - start][start][size - 1] !== '' && 
          board[size - 1 - start][start][size - 1] === board[size - 2 - start][start + 1][size - 1] && 
          board[size - 2 - start][start + 1][size - 1] === board[size - 3 - start][start + 2][size - 1] && 
          board[size - 3 - start][start + 2][size - 1] === board[size - 4 - start][start + 3][size - 1]) {
        return board[size - 1 - start][start][size - 1];
      }
    }

    // Left face (x = 0): diagonals across y and z axes
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal (0,0,0) -> (0,1,1) -> (0,2,2) -> (0,3,3)
      if (board[0][start][start] !== '' && 
          board[0][start][start] === board[0][start + 1][start + 1] && 
          board[0][start + 1][start + 1] === board[0][start + 2][start + 2] && 
          board[0][start + 2][start + 2] === board[0][start + 3][start + 3]) {
        return board[0][start][start];
      }
      // Anti-diagonal (0,0,3) -> (0,1,2) -> (0,2,1) -> (0,3,0)
      if (board[0][start][size - 1 - start] !== '' && 
          board[0][start][size - 1 - start] === board[0][start + 1][size - 2 - start] && 
          board[0][start + 1][size - 2 - start] === board[0][start + 2][size - 3 - start] && 
          board[0][start + 2][size - 3 - start] === board[0][start + 3][size - 4 - start]) {
        return board[0][start][size - 1 - start];
      }
    }

    // Right face (x = 3): diagonals across y and z axes
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal (3,0,0) -> (3,1,1) -> (3,2,2) -> (3,3,3)
      if (board[size - 1][start][start] !== '' && 
          board[size - 1][start][start] === board[size - 1][start + 1][start + 1] && 
          board[size - 1][start + 1][start + 1] === board[size - 1][start + 2][start + 2] && 
          board[size - 1][start + 2][start + 2] === board[size - 1][start + 3][start + 3]) {
        return board[size - 1][start][start];
      }
      // Anti-diagonal (3,0,3) -> (3,1,2) -> (3,2,1) -> (3,3,0)
      if (board[size - 1][start][size - 1 - start] !== '' && 
          board[size - 1][start][size - 1 - start] === board[size - 1][start + 1][size - 2 - start] && 
          board[size - 1][start + 1][size - 2 - start] === board[size - 1][start + 2][size - 3 - start] && 
          board[size - 1][start + 2][size - 3 - start] === board[size - 1][start + 3][size - 4 - start]) {
        return board[size - 1][start][size - 1 - start];
      }
    }

    // Bottom face (y = 0): diagonals across x and z axes
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal (0,0,0) -> (1,0,1) -> (2,0,2) -> (3,0,3)
      if (board[start][0][start] !== '' && 
          board[start][0][start] === board[start + 1][0][start + 1] && 
          board[start + 1][0][start + 1] === board[start + 2][0][start + 2] && 
          board[start + 2][0][start + 2] === board[start + 3][0][start + 3]) {
        return board[start][0][start];
      }
      // Anti-diagonal (3,0,0) -> (2,0,1) -> (1,0,2) -> (0,0,3)
      if (board[size - 1 - start][0][start] !== '' && 
          board[size - 1 - start][0][start] === board[size - 2 - start][0][start + 1] && 
          board[size - 2 - start][0][start + 1] === board[size - 3 - start][0][start + 2] && 
          board[size - 3 - start][0][start + 2] === board[size - 4 - start][0][start + 3]) {
        return board[size - 1 - start][0][start];
      }
    }

    // Top face (y = 3): diagonals across x and z axes
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal (0,3,0) -> (1,3,1) -> (2,3,2) -> (3,3,3)
      if (board[start][size - 1][start] !== '' && 
          board[start][size - 1][start] === board[start + 1][size - 1][start + 1] && 
          board[start + 1][size - 1][start + 1] === board[start + 2][size - 1][start + 2] && 
          board[start + 2][size - 1][start + 2] === board[start + 3][size - 1][start + 3]) {
        return board[start][size - 1][start];
      }
      // Anti-diagonal (3,3,0) -> (2,3,1) -> (1,3,2) -> (0,3,3)
      if (board[size - 1 - start][size - 1][start] !== '' && 
          board[size - 1 - start][size - 1][start] === board[size - 2 - start][size - 1][start + 1] && 
          board[size - 2 - start][size - 1][start + 1] === board[size - 3 - start][size - 1][start + 2] && 
          board[size - 3 - start][size - 1][start + 2] === board[size - 4 - start][size - 1][start + 3]) {
        return board[size - 1 - start][size - 1][start];
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
