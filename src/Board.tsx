import React from 'react';
import { OrbitControls } from '@react-three/drei';
import Cell from './Cell';

interface BoardProps {
  board: string[][][];
  onClick: (layer: number, row: number, col: number) => void;
  currentPlayer: 'X' | 'O';
}

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  // Add spacing between layers to make cubes easier to select
  const layerSpacing = 2; // Increased spacing between layers

  return (
    <>
      {/* Add lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Render the 4x4x4 grid of cells */}
      {board.map((layer, layerIndex) =>
        layer.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${layerIndex}-${rowIndex}-${colIndex}`}
              position={[
                colIndex - 1.5, // Center the grid horizontally (x-axis) - adjusted for 4x4
                layerIndex * layerSpacing - 1.5 * layerSpacing, // Add spacing between layers (y-axis) - adjusted for 4 layers
                rowIndex - 1.5 // Center the grid vertically (z-axis) - adjusted for 4x4
              ]}
              value={cell}
              onClick={() => onClick(layerIndex, rowIndex, colIndex)}
            />
          ))
        )
      )}
      
      {/* Add orbit controls for camera movement */}
      <OrbitControls />
    </>
  );
};

export default Board;
