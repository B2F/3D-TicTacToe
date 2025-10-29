// Simple test script to verify AI functionality
const { getBestMove, checkWin, isBoardFull, getPossibleMoves } = require('./build/static/js/AI.js');

// Create a mock board state for testing
const createEmptyBoard = () => {
  return Array(4).fill(null).map(() => 
    Array(4).fill(null).map(() => Array(4).fill(''))
  );
};

console.log('Testing AI functions...');

// Test 1: Check win detection
const winningBoard = createEmptyBoard();
winningBoard[0][0][0] = 'X';
winningBoard[0][0][1] = 'X';
winningBoard[0][0][2] = 'X';
winningBoard[0][0][3] = 'X';

const isWin = checkWin(winningBoard, 'X');
console.log('Test 1 - Win detection:', isWin ? 'PASS' : 'FAIL');

// Test 2: Check possible moves
const boardWithSomeMoves = createEmptyBoard();
boardWithSomeMoves[0][0][0] = 'X';
boardWithSomeMoves[1][1][1] = 'O';

const possibleMoves = getPossibleMoves(boardWithSomeMoves);
console.log('Test 2 - Possible moves count:', possibleMoves.length === 62 ? 'PASS' : 'FAIL'); // 64 - 2 = 62

// Test 3: Check if board is full
const fullBoard = createEmptyBoard();
for (let x = 0; x < 4; x++) {
  for (let y = 0; y < 4; y++) {
    for (let z = 0; z < 4; z++) {
      fullBoard[x][y][z] = 'X';
    }
 }
}

const emptyBoard = createEmptyBoard();
console.log('Test 3 - Board full detection:', 
  isBoardFull(fullBoard) === true && isBoardFull(emptyBoard) === false ? 'PASS' : 'FAIL');

// Test 4: Get best move (this will test the minimax function)
try {
  const bestMove = getBestMove(emptyBoard, 'X', 'easy');
  const isValidMove = Array.isArray(bestMove) && 
                     bestMove.length === 3 && 
                     bestMove[0] >= 0 && bestMove[0] < 4 &&
                     bestMove[1] >= 0 && bestMove[1] < 4 &&
                     bestMove[2] >= 0 && bestMove[2] < 4 &&
                     emptyBoard[bestMove[0]][bestMove[1]][bestMove[2]] === '';
  
  console.log('Test 4 - Get best move:', isValidMove ? 'PASS' : 'FAIL');
} catch (error) {
  console.log('Test 4 - Get best move: FAIL (Error occurred)');
  console.log('Error:', error.message);
}

console.log('AI function tests completed!');
