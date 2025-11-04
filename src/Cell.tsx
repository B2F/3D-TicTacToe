import React, { useState, memo } from 'react';
import { Text } from '@react-three/drei';

interface CellProps {
  position: [number, number, number];
  value: string;
  onClick: () => void;
  isWinning?: boolean;
}

const Cell: React.FC<CellProps> = memo(({ position, value, onClick, isWinning = false }) => {
  const [hovered, setHovered] = useState(false);

  // Determine cell color based on value, winning status, and hover state
  const getCellColor = () => {
    if (isWinning) {
      return value === 'X' ? '#ffd700' : '#ff6b6b'; // Gold for X winner, bright red for O winner
    }
    return value === 'X' ? '#ff4757' : value === 'O' ? '#2ed573' : hovered ? '#ffa502' : '#add8e6';
  };

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      castShadow
      receiveShadow
      frustumCulled={false}
    >
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial
        color={getCellColor()}
        wireframe={false}
        transparent={value === ''}
        opacity={value === '' ? 0.3 : 1.0}
        emissive={isWinning ? (value === 'X' ? '#ffd700' : '#ff6b6b') : '#000000'}
        emissiveIntensity={isWinning ? 0.2 : 0}
      />
      <>
        {/* Front face */}
        <Text
          position={[0, 0, 0.46]} // Slightly in front of the cube surface
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
        {/* Back face */}
        <Text
          position={[0, 0, -0.46]} // Slightly behind the cube surface
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]} // Rotate 180 degrees around Y axis
        >
          {value}
        </Text>
        {/* Right face */}
        <Text
          position={[0.46, 0, 0]} // Slightly to the right of the cube surface
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]} // Rotate -90 degrees around Y axis
        >
          {value}
        </Text>
        {/* Left face */}
        <Text
          position={[-0.46, 0, 0]} // Slightly to the left of the cube surface
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI / 2, 0]} // Rotate 90 degrees around Y axis
        >
          {value}
        </Text>
        {/* Top face */}
        <Text
          position={[0, 0.46, 0]} // Slightly above the cube surface
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]} // Rotate -90 degrees around X axis
        >
          {value}
        </Text>
        {/* Bottom face */}
        <Text
          position={[0, -0.46, 0]} // Slightly below the cube surface
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[Math.PI / 2, 0, 0]} // Rotate 90 degrees around X axis
        >
          {value}
        </Text>
      </>
    </mesh>
  );
});

Cell.displayName = 'Cell';

export default Cell;
