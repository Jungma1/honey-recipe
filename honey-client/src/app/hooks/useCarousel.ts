import { useRef, useState } from 'react';

export function useCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [isClick, setIsClick] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(true);
    setStartX(e.pageX);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(false);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(false);

    if (scrollRef.current) {
      const snapDistance = startX - e.pageX;
      scrollRef.current.scrollLeft += snapDistance;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClick && scrollRef.current) {
      const snapDistance = startX - e.pageX;
      scrollRef.current.scrollLeft += snapDistance;
      setStartX(e.pageX);
    }
  };

  return { scrollRef, handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove };
}
