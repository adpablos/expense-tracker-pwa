// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { Theme } from './theme';

export const Margin = styled.div<{
  size: keyof Theme['space'];
  direction?: 'top' | 'right' | 'bottom' | 'left' | 'vertical' | 'horizontal' | 'all';
}>`
  ${({ theme, size, direction = 'all' }) => {
    const value = theme.space[size];
    switch (direction) {
      case 'top':
        return `margin-top: ${value};`;
      case 'right':
        return `margin-right: ${value};`;
      case 'bottom':
        return `margin-bottom: ${value};`;
      case 'left':
        return `margin-left: ${value};`;
      case 'vertical':
        return `
          margin-top: ${value};
          margin-bottom: ${value};
        `;
      case 'horizontal':
        return `
          margin-left: ${value};
          margin-right: ${value};
        `;
      default:
        return `margin: ${value};`;
    }
  }}
`;

export const Padding = styled.div<{
  size: keyof Theme['space'];
  direction?: 'top' | 'right' | 'bottom' | 'left' | 'vertical' | 'horizontal' | 'all';
}>`
  ${({ theme, size, direction = 'all' }) => {
    const value = theme.space[size];
    switch (direction) {
      case 'top':
        return `padding-top: ${value};`;
      case 'right':
        return `padding-right: ${value};`;
      case 'bottom':
        return `padding-bottom: ${value};`;
      case 'left':
        return `padding-left: ${value};`;
      case 'vertical':
        return `
          padding-top: ${value};
          padding-bottom: ${value};
        `;
      case 'horizontal':
        return `
          padding-left: ${value};
          padding-right: ${value};
        `;
      default:
        return `padding: ${value};`;
    }
  }}
`;

export const FlexContainer = styled.div<{
  direction?: 'row' | 'column';
  justify?: string;
  align?: string;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'stretch' }) => align};
`;

export const Hide = styled.div<{ breakpoint: keyof Theme['breakpoints'] }>`
  @media (max-width: ${({ theme, breakpoint }) => theme.breakpoints[breakpoint]}) {
    display: none;
  }
`;

export const Show = styled.div<{ breakpoint: keyof Theme['breakpoints'] }>`
  @media (min-width: ${({ theme, breakpoint }) => theme.breakpoints[breakpoint]}) {
    display: none;
  }
`;
