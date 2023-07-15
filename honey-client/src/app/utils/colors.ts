const resolver = (name: string) => `var(--color-${name})`;

export const colors = {
  white: resolver('white'),
  black: resolver('black'),
  gray0: resolver('gray0'),
  gray1: resolver('gray1'),
  gray2: resolver('gray2'),
  gray3: resolver('gray3'),
  gray4: resolver('gray4'),
  gray5: resolver('gray5'),
  gray6: resolver('gray6'),
  gray7: resolver('gray7'),
  gray8: resolver('gray8'),
  gray9: resolver('gray9'),
  danger: resolver('danger'),
  primary: resolver('primary'),
  primaryLight: resolver('primary-light'),
  primaryDark: resolver('primary-dark'),
};
