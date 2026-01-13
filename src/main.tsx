import 'antd/dist/reset.css';
import './styles/retro.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AudioProvider } from './components/Audio';
import MuteButton from './components/MuteButton';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioProvider>
      <MuteButton />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AudioProvider>
  </React.StrictMode>,
);
