import { BoardState, Player, CellValue, Difficulty } from './types';

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

// Win detection function (same as in Game.tsx but exported for AI use)
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

  // Check 3D diagonals - main 3D diagonal directions
  // From (0,0,0) to (3,3,3) - various starting positions
  for (let layer = 0; layer < size - 3; layer++) {
    for (let row = 0; row < size - 3; row++) {
      for (let col = 0; col < size - 3; col++) {
        // Main 3D diagonal (layer, row, col) -> (layer+1, row+1, col+1) -> (layer+2, row+2, col+2) -> (layer+3, row+3, col+3)
        if (board[layer][row][col] !== '' && 
            board[layer][row][col] === player &&
            board[layer][row][col] === board[layer + 1][row + 1][col + 1] && 
            board[layer + 1][row + 1][col + 1] === board[layer + 2][row + 2][col + 2] && 
            board[layer + 2][row + 2][col + 2] === board[layer + 3][row + 3][col + 3]) {
          return true;
        }
        
        // 3D diagonal (layer, row, size-1-col) -> (layer+1, row+1, size-2-col) -> (layer+2, row+2, size-3-col) -> (layer+3, row+3, size-4-col)
        if (board[layer][row][size - 1 - col] !== '' && 
            board[layer][row][size - 1 - col] === player &&
            board[layer][row][size - 1 - col] === board[layer + 1][row + 1][size - 2 - col] && 
            board[layer + 1][row + 1][size - 2 - col] === board[layer + 2][row + 2][size - 3 - col] && 
            board[layer + 2][row + 2][size - 3 - col] === board[layer + 3][row + 3][size - 4 - col]) {
          return true;
        }
        
        // 3D diagonal (layer, size-1-row, col) -> (layer+1, size-2-row, col+1) -> (layer+2, size-3-row, col+2) -> (layer+3, size-4-row, col+3)
        if (board[layer][size - 1 - row][col] !== '' && 
            board[layer][size - 1 - row][col] === player &&
            board[layer][size - 1 - row][col] === board[layer + 1][size - 2 - row][col + 1] && 
            board[layer + 1][size - 2 - row][col + 1] === board[layer + 2][size - 3 - row][col + 2] && 
            board[layer + 2][size - 3 - row][col + 2] === board[layer + 3][size - 4 - row][col + 3]) {
          return true;
        }
        
        // 3D diagonal (layer, size-1-row, size-1-col) -> (layer+1, size-2-row, size-2-col) -> (layer+2, size-3-row, size-3-col) -> (layer+3, size-4-row, size-4-col)
        if (board[layer][size - 1 - row][size - 1 - col] !== '' && 
            board[layer][size - 1 - row][size - 1 - col] === player &&
            board[layer][size - 1 - row][size - 1 - col] === board[layer + 1][size - 2 - row][size - 2 - col] && 
            board[layer + 1][size - 2 - row][size - 2 - col] === board[layer + 2][size - 3 - row][size - 3 - col] && 
            board[layer + 2][size - 3 - row][size - 3 - col] === board[layer + 3][size - 4 - row][size - 4 - col]) {
          return true;
        }
      }
    }
  }

  return false;
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
