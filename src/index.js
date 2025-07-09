import ReactDOM from 'react-dom/client';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import "./index.css";
import './i18n'; 

import { ThemeProvider } from 'next-themes';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HelmetProvider>
    <ThemeProvider defaultTheme="dark" attribute="class">
    <App />
    </ThemeProvider>
  </HelmetProvider>
);
