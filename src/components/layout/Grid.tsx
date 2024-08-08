/* eslint-disable import/no-named-as-default */
import styled from 'styled-components';

interface ContainerProps {
  fluid?: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: ${({ theme }) => theme.space.medium};
  padding-left: ${({ theme }) => theme.space.medium};

  ${({ fluid, theme }) =>
    !fluid &&
    `
    @media (min-width: ${theme.breakpoints.tablet}) {
      max-width: 720px;
    }

    @media (min-width: ${theme.breakpoints.desktop}) {
      max-width: 1140px;
    }
  `}
`;

interface RowProps {
  noGutters?: boolean;
}

export const Row = styled.div<RowProps>`
  display: flex;
  flex-wrap: wrap;
  margin-right: ${({ noGutters }) => (noGutters ? '0' : '-15px')};
  margin-left: ${({ noGutters }) => (noGutters ? '0' : '-15px')};
`;

interface ColProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

const getWidthString = (span: number) => {
  if (!span) return;

  const width = (span / 12) * 100;
  return `flex: 0 0 ${width}%;
          max-width: ${width}%;`;
};

export const Col = styled.div<ColProps>`
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;

  ${({ xs }) => (xs ? getWidthString(xs) : 'flex: 0 0 100%; max-width: 100%;')}

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ sm }) => sm && getWidthString(sm)}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    ${({ md }) => md && getWidthString(md)}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    ${({ lg }) => lg && getWidthString(lg)}
  }
`;
