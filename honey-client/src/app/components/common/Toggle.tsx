import React from 'react';

interface Props {
  isValue: boolean;
  onComponent: React.ReactNode;
  offComponent: React.ReactNode;
}

function Toggle({ isValue, onComponent, offComponent }: Props) {
  return <>{isValue ? onComponent : offComponent}</>;
}

export default Toggle;
