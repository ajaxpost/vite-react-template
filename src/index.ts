import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const dom = document.getElementById('root');
if (dom) {
  const root = createRoot(dom);
  root.render(React.createElement(App));
}
