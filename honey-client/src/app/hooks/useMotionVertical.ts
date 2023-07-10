import { useState } from 'react';

export function useMotionVertical(value: number, direction: boolean = true) {
  const [y, setY] = useState(0);

  const handleMouseEnter = () => {
    direction ? setY(-value) : setY(value);
  };

  const handleMouseLeave = () => {
    setY(0);
  };

  return { y, handleMouseEnter, handleMouseLeave };
}
