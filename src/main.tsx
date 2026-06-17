import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

document.addEventListener(
  'dblclick',
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
