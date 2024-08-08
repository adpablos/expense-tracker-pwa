import { createGlobalStyle } from 'styled-components';

import { theme } from './theme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.padding.medium};
    color: ${theme.colors.text};
  }

  p {
    margin-bottom: ${theme.padding.small};
  }

  // Estilos para el scrollbar
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primaryHover};
  }

  // Clase de utilidad para ocultar elementos visualmente pero mantenerlos accesibles
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export default GlobalStyle;
