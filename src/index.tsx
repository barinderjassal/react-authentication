import { createElement } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/app';
import { AuthContextProvider } from './context/auth-context';

import './index.css';

render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>,
document.getElementById('app'));
