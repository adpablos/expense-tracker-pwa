import 'styled-components';
import type { Theme } from './theme';

declare module 'styled-components' {
  // Extend DefaultTheme with our Theme shape
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
