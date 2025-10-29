import { getBestMove, checkWin, isBoardFull, getPossibleMoves, evaluateBoard, minimax } from './AI';
import { BoardState } from './types';

describe('AI Functions', () => {
  test('should detect win conditions correctly', () => {
    // Test row win in first layer
    const winningBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    // Fill first row with X
    winningBoard[0][0][0] = 'X';
    winningBoard[0][0][1] = 'X';
    winningBoard[0][0][2] = 'X';
    winningBoard[0][0][3] = 'X';
    
    expect(checkWin(winningBoard, 'X')).toBe(true);
    expect(checkWin(winningBoard, 'O')).toBe(false);
  });

  test('should detect when board is full', () => {
    const fullBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill('X'))
    );
    
    // Make one cell empty to test
    fullBoard[0][0][0] = '';
    expect(isBoardFull(fullBoard)).toBe(false);
    
    // Fill the last cell
    fullBoard[0][0][0] = 'O';
    expect(isBoardFull(fullBoard)).toBe(true);
  });

  test('should get possible moves correctly', () => {
    const board: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    // Fill some cells
    board[0][0][0] = 'X';
    board[1][1][1] = 'O';
    
    const possibleMoves = getPossibleMoves(board);
    expect(possibleMoves.length).toBe(64 - 2); // 64 total cells - 2 filled
    
    // Check that filled positions are not in possible moves
    expect(possibleMoves).not.toContain([0, 0, 0]);
    expect(possibleMoves).not.toContain([1, 1, 1]);
    
    // Check that empty positions are in possible moves
    expect(possibleMoves).toContain([0, 0, 1]);
    expect(possibleMoves).toContain([2, 2, 2]);
  });

  test('should evaluate board positions', () => {
    const emptyBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    // Empty board should have neutral evaluation
    expect(evaluateBoard(emptyBoard, 'X')).toBe(0);
    
    // Board with one X should favor X
    const boardWithX: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    boardWithX[0][0][0] = 'X';
    expect(evaluateBoard(boardWithX, 'X')).toBeGreaterThan(0);
    
    // Board with one O should favor X less (or favor O more)
    const boardWithO: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    boardWithO[0][0][0] = 'O';
    expect(evaluateBoard(boardWithO, 'X')).toBeLessThan(0);
  });

  test('should find best move for easy difficulty', () => {
    const emptyBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    const bestMove = getBestMove(emptyBoard, 'X', 'easy');
    expect(Array.isArray(bestMove)).toBe(true);
    expect(bestMove.length).toBe(3);
    expect(bestMove[0]).toBeGreaterThanOrEqual(0);
    expect(bestMove[0]).toBeLessThan(4);
    expect(bestMove[1]).toBeGreaterThanOrEqual(0);
    expect(bestMove[1]).toBeLessThan(4);
    expect(bestMove[2]).toBeGreaterThanOrEqual(0);
    expect(bestMove[2]).toBeLessThan(4);
    
    // The cell should be empty
    expect(emptyBoard[bestMove[0]][bestMove[1]][bestMove[2]]).toBe('');
  });

  test('should find best move for medium difficulty', () => {
    const emptyBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    const bestMove = getBestMove(emptyBoard, 'X', 'medium');
    expect(Array.isArray(bestMove)).toBe(true);
    expect(bestMove.length).toBe(3);
    expect(bestMove[0]).toBeGreaterThanOrEqual(0);
    expect(bestMove[0]).toBeLessThan(4);
    expect(bestMove[1]).toBeGreaterThanOrEqual(0);
    expect(bestMove[1]).toBeLessThan(4);
    expect(bestMove[2]).toBeGreaterThanOrEqual(0);
    expect(bestMove[2]).toBeLessThan(4);
    
    // The cell should be empty
    expect(emptyBoard[bestMove[0]][bestMove[1]][bestMove[2]]).toBe('');
  });

  test('should find best move for hard difficulty', () => {
    const emptyBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    const bestMove = getBestMove(emptyBoard, 'X', 'hard');
    expect(Array.isArray(bestMove)).toBe(true);
    expect(bestMove.length).toBe(3);
    expect(bestMove[0]).toBeGreaterThanOrEqual(0);
    expect(bestMove[0]).toBeLessThan(4);
    expect(bestMove[1]).toBeGreaterThanOrEqual(0);
    expect(bestMove[1]).toBeLessThan(4);
    expect(bestMove[2]).toBeGreaterThanOrEqual(0);
    expect(bestMove[2]).toBeLessThan(4);
    
    // The cell should be empty
    expect(emptyBoard[bestMove[0]][bestMove[1]][bestMove[2]]).toBe('');
  });

  test('should handle minimax with alpha-beta pruning', () => {
    const emptyBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    const result = minimax(emptyBoard, 0, -Infinity, Infinity, true, 'X', 'easy');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('move');
    expect(result.move).toBeNull(); // At depth 0 with empty board, no specific move needed
  });

  test('should handle minimax with winning position', () => {
    const winningBoard: BoardState = Array(4).fill(null).map(() => 
      Array(4).fill(null).map(() => Array(4).fill(''))
    );
    
    // Set up a winning position for X
    winningBoard[0][0][0] = 'X';
    winningBoard[0][0][1] = 'X';
    winningBoard[0][0][2] = 'X';
    // Leave [0][0][3] empty for X to win
    
    const result = minimax(winningBoard, 0, -Infinity, Infinity, true, 'X', 'medium');
    expect(result.score).toBeGreaterThan(900); // Should be close to 1000 for winning position
 });
});
