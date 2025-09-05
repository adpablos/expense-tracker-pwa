import React from 'react';
import styledComponents from 'styled-components';

type Direction = 'row' | 'column';

interface StackProps {
  direction?: Direction;
  gap?: keyof typeof defaultGaps;
  align?: string;
  justify?: string;
  wrap?: boolean;
  children: React.ReactNode;
  className?: string;
}

const defaultGaps = {
  none: '0',
  xxs: '0.25rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

const StackRoot = styledComponents.div<{
  $direction: Direction;
  $gap: keyof typeof defaultGaps;
  $align?: string;
  $justify?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  gap: ${({ $gap }) => defaultGaps[$gap]};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
`;

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  gap = 'md',
  align,
  justify,
  wrap,
  children,
  className,
}) => {
  return (
    <StackRoot
      $direction={direction}
      $gap={gap}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      className={className}
    >
      {children}
    </StackRoot>
  );
};
export default Stack;
