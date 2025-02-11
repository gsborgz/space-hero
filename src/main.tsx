import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/index.css';
import Interface from './components/interface';
import { GameManager } from './classes/game-manager';
import { Provider } from 'jotai';
import { store } from './store';

const gameManager = new GameManager();

createRoot(document.getElementById('ui')!).render(
  <StrictMode>
    <Provider store={store}>
      <Interface />
    </Provider>
  </StrictMode>,
);

gameManager.start();
