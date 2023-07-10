import { useState } from 'react';

export function useMotionHorizontal(value: number, direction: boolean = true) {
  const [x, setX] = useState(0);

  const handleMouseEnter = () => {
    direction ? setX(-value) : setX(value);
  };

  const handleMouseLeave = () => {
    setX(0);
  };

  return { x, handleMouseEnter, handleMouseLeave };
}
