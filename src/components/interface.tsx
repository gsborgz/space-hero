import { useAtomValue } from 'jotai';
import React from 'react';
import { life, score } from '../store';

export default function Interface() {
  const scoreValue = useAtomValue(score);
  const lifeValue = useAtomValue(life);

  return (
    <div className='info'>
      <span>LIFE: {lifeValue}</span>
      <span>SCORE: {scoreValue}</span>
    </div>
  );
}
