import React from 'react';
import styledComponents from 'styled-components';

type TagVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
}

import type { Theme } from '../../styles/theme';

type ThemeColorPicker = (t: Theme) => string;

const variantStyles: Record<
  TagVariant,
  {
    bg: ThemeColorPicker;
    fg: ThemeColorPicker;
  }
> = {
  neutral: {
    bg: (t) => t.colors.backgroundDark,
    fg: (t) => t.colors.text,
  },
  primary: {
    bg: (t) => t.colors.primary,
    fg: (t) => t.colors.backgroundLight,
  },
  success: {
    bg: (t) => t.colors.success,
    fg: (t) => t.colors.backgroundLight,
  },
  warning: {
    bg: (t) => t.colors.warning,
    fg: (t) => t.colors.textDark,
  },
  danger: {
    bg: (t) => t.colors.danger,
    fg: (t) => t.colors.backgroundLight,
  },
};

const TagRoot = styledComponents.span<{ $variant: TagVariant }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  background-color: ${({ theme, $variant }) => variantStyles[$variant].bg(theme)};
  color: ${({ theme, $variant }) => variantStyles[$variant].fg(theme)};
`;

export const Tag: React.FC<TagProps> = ({ children, variant = 'neutral' }) => {
  return <TagRoot $variant={variant}>{children}</TagRoot>;
};

export default Tag;
