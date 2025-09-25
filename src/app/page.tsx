'use client';

import { Provider } from 'jotai';
import { GameManager } from '@classes/game-manager';
import { store } from '@/store';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { life, score } from '@/store';

export default function Home() {
  useEffect(() => {
    const gameManager = new GameManager();
    gameManager.start();
  }, []);

  return (
    <Provider store={store}>
      <GameUI />
    </Provider>
  );
}

function GameUI() {
  const scoreValue = useAtomValue(score);
  const lifeValue = useAtomValue(life);

  return (
    <div className='flex flex-col h-full items-center justify-center'>
      <div id="ui"></div>
      <div className='w-full flex items-center justify-center'>
        <div className='flex items-center justify-center gap-16 text-white font-bold font-mono text-lg mb-2'>
          <span>LIFE: {lifeValue}</span>
          <span>SCORE: {scoreValue}</span>
        </div>
      </div>
      <canvas id="game" className="w-[35rem] h-[35rem]"></canvas>
    </div>
  );
}
