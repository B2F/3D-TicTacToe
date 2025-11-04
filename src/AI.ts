// Optimized win detection function using direction vectors
import { BoardState, Player, Difficulty } from './types';

export type WinningCells = [number, number, number][];

export const checkWin = (board: BoardState, player: Player): WinningCells | null => {
  const size = 4;
  const directions = [
    [1,0,0], [0,1,0], [0,0,1],  // orthogonal
    [1,1,0], [1,-1,0], [0,1,1], [0,1,-1], [1,0,1], [1,0,-1],  // 2D diagonals
    [1,1,1], [1,1,-1], [1,-1,1], [-1,1,1]  // 3D diagonals
  ];

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        if (board[x][y][z] === player) {
          for (const [dx, dy, dz] of directions) {
            const winningCells: WinningCells = [];
            let count = 0;

            for (let i = 0; i < 4; i++) {
              const nx = x + dx * i, ny = y + dy * i, nz = z + dz * i;
              if (nx >= 0 && nx < size && ny >= 0 && ny < size && nz >= 0 && nz < size &&
                  board[nx][ny][nz] === player) {
                winningCells.push([nx, ny, nz]);
                count++;
              } else break;
            }

            if (count >= 4) {
              return winningCells;
            }
          }
        }
      }
    }
  }
  return null;
};

// Legacy boolean version for backward compatibility
export const hasWinner = (board: BoardState, player: Player): boolean => {
  return checkWin(board, player) !== null;
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

// Helper function to generate all possible 4-cell lines
const generateAllPossibleLines = (board: BoardState): string[][] => {
  const lines: string[][] = [];
  const size = 4;

  // All possible directions for 4-cell lines
  const directions = [
    [1,0,0], [0,1,0], [0,0,1],  // orthogonal
    [1,1,0], [1,-1,0], [0,1,1], [0,1,-1], [1,0,1], [1,0,-1],  // 2D diagonals
    [1,1,1], [1,1,-1], [1,-1,1], [-1,1,1]  // 3D diagonals
  ];

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        for (const [dx, dy, dz] of directions) {
          const line: string[] = [];
          let valid = true;

          for (let i = 0; i < 4; i++) {
            const nx = x + dx * i, ny = y + dy * i, nz = z + dz * i;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size && nz >= 0 && nz < size) {
              line.push(board[nx][ny][nz]);
            } else {
              valid = false;
              break;
            }
          }

          if (valid) {
            lines.push(line);
          }
        }
      }
    }
  }

  return lines;
};

// Improved evaluation function for the board position
export const evaluateBoard = (board: BoardState, maximizingPlayer: Player): number => {
  const opponent: Player = maximizingPlayer === 'X' ? 'O' : 'X';

  // Check for win/loss
  if (checkWin(board, maximizingPlayer)) return 1000;
  if (checkWin(board, opponent)) return -1000;

  // If board is full and no winner, it's a draw
  if (isBoardFull(board)) return 0;

  // Evaluate based on potential winning lines
  let score = 0;
  const lines = generateAllPossibleLines(board);

  for (const line of lines) {
    const playerCount = line.filter(cell => cell === maximizingPlayer).length;
    const opponentCount = line.filter(cell => cell === opponent).length;
    const emptyCount = line.filter(cell => cell === '').length;

    if (playerCount === 4) return 1000;
    if (opponentCount === 4) return -1000;

    if (playerCount > 0 && opponentCount === 0) {
      // Player has potential in this line
      score += Math.pow(10, playerCount);
    }
    if (opponentCount > 0 && playerCount === 0) {
      // Opponent has potential in this line
      score -= Math.pow(10, opponentCount);
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
  maxDepth: number
): { score: number; move: [number, number, number] | null } => {
  const opponent: Player = maximizingPlayer === 'X' ? 'O' : 'X';
  const currentPlayer: Player = isMaximizing ? maximizingPlayer : opponent;

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
      const result = minimax(newBoard, depth + 1, alpha, beta, false, maximizingPlayer, maxDepth);
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
      const result = minimax(newBoard, depth + 1, alpha, beta, true, maximizingPlayer, maxDepth);
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

// Function to get the best move for the computer player with fixed depth limits
export const getBestMove = (board: BoardState, player: Player, difficulty: Difficulty): [number, number, number] => {
  // Set depth limits based on difficulty (not time-based to ensure consistent difficulty)
  const depthLimits = {
    easy: 1,      // Very shallow search - basic blocking
    medium: 3,    // Moderate depth - strategic play
    hard: 5       // Deep search - expert level
  };

  const maxDepth = depthLimits[difficulty];
  const result = minimax(board, 0, -Infinity, Infinity, true, player, maxDepth);

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
