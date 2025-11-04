// Win detection function (same as in Game.tsx but exported for AI use)
import { BoardState, Player, Difficulty } from './types';
export const checkWin = (board: BoardState, player: Player): boolean => {
  const size = 4;

  // Check for winning combinations in 3D
  for (let layer = 0; layer < size; layer++) {
    // Check rows in the current layer
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size - 3; col++) {
        if (board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer][row][col + 1] &&
            board[layer][row][col + 1] === board[layer][row][col + 2] &&
            board[layer][row][col + 2] === board[layer][row][col + 3]) {
          return true;
        }
      }
    }

    // Check columns in the current layer
    for (let col = 0; col < size; col++) {
      for (let row = 0; row < size - 3; row++) {
        if (board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer][row + 1][col] &&
            board[layer][row + 1][col] === board[layer][row + 2][col] &&
            board[layer][row + 2][col] === board[layer][row + 3][col]) {
          return true;
        }
      }
    }
  }

  // Check pillars (vertical across layers)
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      for (let layer = 0; layer < size - 3; layer++) {
        if (board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer + 1][row][col] &&
            board[layer + 1][row][col] === board[layer + 2][row][col] &&
            board[layer + 2][row][col] === board[layer + 3][row][col]) {
          return true;
        }
      }
    }
  }

  // Check diagonals in each layer (main diagonal)
  for (let layer = 0; layer < size; layer++) {
    for (let start = 0; start < size - 3; start++) {
      if (board[layer][start][start] !== '' &&
          board[layer][start][start] === player &&
          board[layer][start][start] === board[layer][start + 1][start + 1] &&
          board[layer][start + 1][start + 1] === board[layer][start + 2][start + 2] &&
          board[layer][start + 2][start + 2] === board[layer][start + 3][start + 3]) {
        return true;
      }
    }
  }

  // Check diagonals in each layer (anti-diagonal)
  for (let layer = 0; layer < size; layer++) {
    for (let start = 0; start < size - 3; start++) {
      if (board[layer][start][size - 1 - start] !== '' &&
          board[layer][start][size - 1 - start] === player &&
          board[layer][start][size - 1 - start] === board[layer][start + 1][size - 2 - start] &&
          board[layer][start + 1][size - 2 - start] === board[layer][start + 2][size - 3 - start] &&
          board[layer][start + 2][size - 3 - start] === board[layer][start + 3][size - 4 - start]) {
        return true;
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
            board[startLayer][startRow][startCol] === player &&
            board[startLayer][startRow][startCol] === board[startLayer + 1][startRow + 1][startCol + 1] &&
            board[startLayer + 1][startRow + 1][startCol + 1] === board[startLayer + 2][startRow + 2][startCol + 2] &&
            board[startLayer + 2][startRow + 2][startCol + 2] === board[startLayer + 3][startRow + 3][startCol + 3]) {
          return true;
        }

        // (layer, row, size-1-col) -> (layer+1, row+1, size-2-col) -> (layer+2, row+2, size-3-col) -> (layer+3, row+3, size-4-col)
        if (board[startLayer][startRow][size - 1 - startCol] !== '' &&
            board[startLayer][startRow][size - 1 - startCol] === player &&
            board[startLayer][startRow][size - 1 - startCol] === board[startLayer + 1][startRow + 1][size - 2 - startCol] &&
            board[startLayer + 1][startRow + 1][size - 2 - startCol] === board[startLayer + 2][startRow + 2][size - 3 - startCol] &&
            board[startLayer + 2][startRow + 2][size - 3 - startCol] === board[startLayer + 3][startRow + 3][size - 4 - startCol]) {
          return true;
        }

        // (layer, size-1-row, col) -> (layer+1, size-2-row, col+1) -> (layer+2, size-3-row, col+2) -> (layer+3, size-4-row, col+3)
        if (board[startLayer][size - 1 - startRow][startCol] !== '' &&
            board[startLayer][size - 1 - startRow][startCol] === player &&
            board[startLayer][size - 1 - startRow][startCol] === board[startLayer + 1][size - 2 - startRow][startCol + 1] &&
            board[startLayer + 1][size - 2 - startRow][startCol + 1] === board[startLayer + 2][size - 3 - startRow][startCol + 2] &&
            board[startLayer + 2][size - 3 - startRow][startCol + 2] === board[startLayer + 3][size - 4 - startRow][startCol + 3]) {
          return true;
        }

        // (layer, size-1-row, size-1-col) -> (layer+1, size-2-row, size-2-col) -> (layer+2, size-3-row, size-3-col) -> (layer+3, size-4-row, size-4-col)
        if (board[startLayer][size - 1 - startRow][size - 1 - startCol] !== '' &&
            board[startLayer][size - 1 - startRow][size - 1 - startCol] === player &&
            board[startLayer][size - 1 - startRow][size - 1 - startCol] === board[startLayer + 1][size - 2 - startRow][size - 2 - startCol] &&
            board[startLayer + 1][size - 2 - startRow][size - 2 - startCol] === board[startLayer + 2][size - 3 - startRow][size - 3 - startCol] &&
            board[startLayer + 2][size - 3 - startRow][size - 3 - startCol] === board[startLayer + 3][size - 4 - startRow][size - 4 - startCol]) {
          return true;
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
            board[startLayer][startRow][startCol] === player &&
            board[startLayer][startRow][startCol] === board[startLayer - 1][startRow - 1][startCol - 1] &&
            board[startLayer - 1][startRow - 1][startCol - 1] === board[startLayer - 2][startRow - 2][startCol - 2] &&
            board[startLayer - 2][startRow - 2][startCol - 2] === board[startLayer - 3][startRow - 3][startCol - 3]) {
          return true;
        }

        // (layer, row, size-1-col) -> (layer-1, row-1, size-2-col) -> (layer-2, row-2, size-3-col) -> (layer-3, row-3, size-4-col)
        if (board[startLayer][startRow][size - 1 - startCol] !== '' &&
            board[startLayer][startRow][size - 1 - startCol] === player &&
            board[startLayer][startRow][size - 1 - startCol] === board[startLayer - 1][startRow - 1][size - 2 - startCol] &&
            board[startLayer - 1][startRow - 1][size - 2 - startCol] === board[startLayer - 2][startRow - 2][size - 3 - startCol] &&
            board[startLayer - 2][startRow - 2][size - 3 - startCol] === board[startLayer - 3][startRow - 3][size - 4 - startCol]) {
          return true;
        }

        // (layer, size-1-row, col) -> (layer-1, size-2-row, col-1) -> (layer-2, size-3-row, col-2) -> (layer-3, size-4-row, col-3)
        if (board[startLayer][size - 1 - startRow][startCol] !== '' &&
            board[startLayer][size - 1 - startRow][startCol] === player &&
            board[startLayer][size - 1 - startRow][startCol] === board[startLayer - 1][size - 2 - startRow][startCol - 1] &&
            board[startLayer - 1][size - 2 - startRow][startCol - 1] === board[startLayer - 2][size - 3 - startRow][startCol - 2] &&
            board[startLayer - 2][size - 3 - startRow][startCol - 2] === board[startLayer - 3][size - 4 - startRow][startCol - 3]) {
          return true;
        }

        // (layer, size-1-row, size-1-col) -> (layer-1, size-2-row, size-2-col) -> (layer-2, size-3-row, size-3-col) -> (layer-3, size-4-row, size-4-col)
        if (board[startLayer][size - 1 - startRow][size - 1 - startCol] !== '' &&
            board[startLayer][size - 1 - startRow][size - 1 - startCol] === player &&
            board[startLayer][size - 1 - startRow][size - 1 - startCol] === board[startLayer - 1][size - 2 - startRow][size - 2 - startCol] &&
            board[startLayer - 1][size - 2 - startRow][size - 2 - startCol] === board[startLayer - 2][size - 3 - startRow][size - 3 - startCol] &&
            board[startLayer - 2][size - 3 - startRow][size - 3 - startCol] === board[startLayer - 3][size - 4 - startRow][size - 4 - startCol]) {
          return true;
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
          board[start][y][start] === player &&
          board[start][y][start] === board[start + 1][y][start + 1] &&
          board[start + 1][y][start + 1] === board[start + 2][y][start + 2] &&
          board[start + 2][y][start + 2] === board[start + 3][y][start + 3]) {
        return true;
      }
      // Anti-diagonal in XZ plane: (start,y,size-start-1) -> (start+1,y,size-start-2) -> (start+2,y,size-start-3) -> (start+3,y,size-start-4)
      if (board[start][y][size - start - 1] !== '' &&
          board[start][y][size - start - 1] === player &&
          board[start][y][size - start - 1] === board[start + 1][y][size - start - 2] &&
          board[start + 1][y][size - start - 2] === board[start + 2][y][size - start - 3] &&
          board[start + 2][y][size - start - 3] === board[start + 3][y][size - start - 4]) {
        return true;
      }
    }
  }

  // Check 2D diagonals in YZ planes (constant X, vertical slices through rows and columns)
  // These are diagonals in planes where the X-coordinate is constant
  for (let x = 0; x < size; x++) {
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal in YZ plane: (x,start,start) -> (x,start+1,start+1) -> (x,start+2,start+2) -> (x,start+3,start+3)
      if (board[x][start][start] !== '' &&
          board[x][start][start] === player &&
          board[x][start][start] === board[x][start + 1][start + 1] &&
          board[x][start + 1][start + 1] === board[x][start + 2][start + 2] &&
          board[x][start + 2][start + 2] === board[x][start + 3][start + 3]) {
        return true;
      }
      // Anti-diagonal in YZ plane: (x,start,size-start-1) -> (x,start+1,size-start-2) -> (x,start+2,size-start-3) -> (x,start+3,size-start-4)
      if (board[x][start][size - start - 1] !== '' &&
          board[x][start][size - start - 1] === player &&
          board[x][start][size - start - 1] === board[x][start + 1][size - start - 2] &&
          board[x][start + 1][size - start - 2] === board[x][start + 2][size - start - 3] &&
          board[x][start + 2][size - start - 3] === board[x][start + 3][size - start - 4]) {
        return true;
      }
    }
  }

  // Check 2D diagonals in XY planes (constant Z, horizontal slices through layers and rows)
  // These are diagonals in planes where the Z-coordinate is constant
  for (let z = 0; z < size; z++) {
    for (let start = 0; start < size - 3; start++) {
      // Main diagonal in XY plane: (start,start,z) -> (start+1,start+1,z) -> (start+2,start+2,z) -> (start+3,start+3,z)
      if (board[start][start][z] !== '' &&
          board[start][start][z] === player &&
          board[start][start][z] === board[start + 1][start + 1][z] &&
          board[start + 1][start + 1][z] === board[start + 2][start + 2][z] &&
          board[start + 2][start + 2][z] === board[start + 3][start + 3][z]) {
        return true;
      }
      // Anti-diagonal in XY plane: (start,size-start-1,z) -> (start+1,size-start-2,z) -> (start+2,size-start-3,z) -> (start+3,size-start-4,z)
      if (board[start][size - start - 1][z] !== '' &&
          board[start][size - start - 1][z] === player &&
          board[start][size - start - 1][z] === board[start + 1][size - start - 2][z] &&
          board[start + 1][size - start - 2][z] === board[start + 2][size - start - 3][z] &&
          board[start + 2][size - start - 3][z] === board[start + 3][size - start - 4][z]) {
        return true;
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
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer + 1][row + 1][col - 1] &&
            board[layer + 1][row + 1][col - 1] === board[layer + 2][row + 2][col - 2] &&
            board[layer + 2][row + 2][col - 2] === board[layer + 3][row + 3][col - 3]) {
          return true;
        }

        // Direction: (+1, -1, +1) - layer increases, row decreases, col increases
        if (layer < size - 3 && row >= 3 && col < size - 3 &&
            board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer + 1][row - 1][col + 1] &&
            board[layer + 1][row - 1][col + 1] === board[layer + 2][row - 2][col + 2] &&
            board[layer + 2][row - 2][col + 2] === board[layer + 3][row - 3][col + 3]) {
          return true;
        }

        // Direction: (-1, +1, +1) - layer decreases, row increases, col increases
        if (layer >= 3 && row < size - 3 && col < size - 3 &&
            board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer - 1][row + 1][col + 1] &&
            board[layer - 1][row + 1][col + 1] === board[layer - 2][row + 2][col + 2] &&
            board[layer - 2][row + 2][col + 2] === board[layer - 3][row + 3][col + 3]) {
          return true;
        }

        // Direction: (+1, -1, -1) - layer increases, row decreases, col decreases
        if (layer < size - 3 && row >= 3 && col >= 3 &&
            board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer + 1][row - 1][col - 1] &&
            board[layer + 1][row - 1][col - 1] === board[layer + 2][row - 2][col - 2] &&
            board[layer + 2][row - 2][col - 2] === board[layer + 3][row - 3][col - 3]) {
          return true;
        }

        // Direction: (-1, +1, -1) - layer decreases, row increases, col decreases
        if (layer >= 3 && row < size - 3 && col >= 3 &&
            board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer - 1][row + 1][col - 1] &&
            board[layer - 1][row + 1][col - 1] === board[layer - 2][row + 2][col - 2] &&
            board[layer - 2][row + 2][col - 2] === board[layer - 3][row + 3][col - 3]) {
          return true;
        }

        // Direction: (-1, -1, +1) - layer decreases, row decreases, col increases
        if (layer >= 3 && row >= 3 && col < size - 3 &&
            board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer - 1][row - 1][col + 1] &&
            board[layer - 1][row - 1][col + 1] === board[layer - 2][row - 2][col + 2] &&
            board[layer - 2][row - 2][col + 2] === board[layer - 3][row - 3][col + 3]) {
          return true;
        }

        // Direction: (-1, -1, -1) - all coordinates decrease
        if (layer >= 3 && row >= 3 && col >= 3 &&
            board[layer][row][col] !== '' &&
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer - 1][row - 1][col - 1] &&
            board[layer - 1][row - 1][col - 1] === board[layer - 2][row - 2][col - 2] &&
            board[layer - 2][row - 2][col - 2] === board[layer - 3][row - 3][col - 3]) {
          return true;
        }
      }
    }
  }

  return false;
};

// Helper function to check if board is full
export const isBoardFull = (board: BoardState): boolean => {
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      for (let z = 0; z < 4; z++) {
        if (board[x][y][z] === '') {
          return false;
        }
      }
    }
  }
  return true;
};

// Helper function to get all possible moves
export const getPossibleMoves = (board: BoardState): [number, number, number][] => {
  const moves: [number, number, number][] = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      for (let z = 0; z < 4; z++) {
        if (board[x][y][z] === '') {
          moves.push([x, y, z]);
        }
      }
    }
  }
  return moves;
};

// Helper function to make a move on a board copy
export const makeMove = (board: BoardState, x: number, y: number, z: number, player: Player): BoardState => {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[x][y][z] = player;
  return newBoard;
};

// Evaluation function for the board position
export const evaluateBoard = (board: BoardState, maximizingPlayer: Player): number => {
  const opponent: Player = maximizingPlayer === 'X' ? 'O' : 'X';

  // Check for win/loss
  if (checkWin(board, maximizingPlayer)) return 1000;
  if (checkWin(board, opponent)) return -1000;

  // If board is full and no winner, it's a draw
  if (isBoardFull(board)) return 0;

  // Evaluate based on potential winning lines and control
  let score = 0;

  // Evaluate potential winning opportunities
  // This is a simplified evaluation - could be enhanced for better AI
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      for (let z = 0; z < 4; z++) {
        if (board[x][y][z] === maximizingPlayer) {
          score += 1; // Basic score for player pieces
        } else if (board[x][y][z] === opponent) {
          score -= 1; // Penalty for opponent pieces
        }
      }
    }
  }

  return score;
};

// Minimax algorithm with alpha-beta pruning
export const minimax = (
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  maximizingPlayer: Player,
  difficulty: Difficulty
): { score: number; move: [number, number, number] | null } => {
  const opponent: Player = maximizingPlayer === 'X' ? 'O' : 'X';
  const currentPlayer: Player = isMaximizing ? maximizingPlayer : opponent;

  // Determine max depth based on difficulty
  let maxDepth = 0;
  switch (difficulty) {
    case 'easy':
      maxDepth = 2;
      break;
    case 'medium':
      maxDepth = 4;
      break;
    case 'hard':
      maxDepth = 6;
      break;
  }

  // Check terminal conditions
  if (checkWin(board, maximizingPlayer)) {
    return { score: 1000 - depth, move: null }; // Prefer faster wins
  }
  if (checkWin(board, opponent)) {
    return { score: -1000 + depth, move: null }; // Prefer slower losses
  }
  if (isBoardFull(board) || depth >= maxDepth) {
    return { score: evaluateBoard(board, maximizingPlayer), move: null };
  }

  const possibleMoves = getPossibleMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove: [number, number, number] | null = null;

    for (const [x, y, z] of possibleMoves) {
      const newBoard = makeMove(board, x, y, z, currentPlayer);
      const result = minimax(newBoard, depth + 1, alpha, beta, false, maximizingPlayer, difficulty);
      const score = result.score;

      if (score > bestScore) {
        bestScore = score;
        bestMove = [x, y, z];
      }

      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }

    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove: [number, number, number] | null = null;

    for (const [x, y, z] of possibleMoves) {
      const newBoard = makeMove(board, x, y, z, currentPlayer);
      const result = minimax(newBoard, depth + 1, alpha, beta, true, maximizingPlayer, difficulty);
      const score = result.score;

      if (score < bestScore) {
        bestScore = score;
        bestMove = [x, y, z];
      }

      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }

    return { score: bestScore, move: bestMove };
  }
};

// Function to get the best move for the computer player
export const getBestMove = (board: BoardState, player: Player, difficulty: Difficulty): [number, number, number] => {
  const result = minimax(board, 0, -Infinity, Infinity, true, player, difficulty);
  if (result.move) {
    return result.move;
  } else {
    // Fallback to random move if no best move found
    const possibleMoves = getPossibleMoves(board);
    if (possibleMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      return possibleMoves[randomIndex];
    }
    throw new Error('No possible moves available');
  }
};
