// Define the types for the 3D Tic Tac Toe game

export type Player = 'X' | 'O';
export type CellValue = Player | '';
export type BoardState = CellValue[][][];
export type Difficulty = 'easy' | 'medium' | 'hard';
