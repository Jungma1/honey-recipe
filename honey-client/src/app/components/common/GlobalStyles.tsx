import { css, Global } from '@emotion/react';

function GlobalStyles() {
  return <Global styles={styles} />;
}

const styles = css`
  html {
    height: 100%;
    box-sizing: border-box;
  }

  * {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    height: 100%;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue',
      'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
  }

  #__next {
    height: 100%;
  }

  button,
  input,
  textarea {
    font-family: inherit;
  }

  button {
    padding: 0;
    background: none;
    border: none;
    outline: none;
  }

  a {
    color: black;
    text-decoration: none;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }

  :root {
    --color-white: #fdfdfd;
    --color-black: #030612;

    --color-gray0: #e3e3e3;
    --color-gray1: #c5c5c5;
    --color-gray2: #a6a6a6;
    --color-gray3: #828282;
    --color-gray4: #727272;
    --color-gray5: #626262;
    --color-gray6: #4e4e4e;
    --color-gray7: #3c3c3c;
    --color-gray8: #2c2c2c;
    --color-gray9: #151515;

    --color-danger: #ff7272;

    --color-primary: #ff7f2a;
    --color-primary-light: #ff9955;
    --color-primary-dark: #cc6622;

    --color-secondary: #465680;
    --color-secondary-light: #6b7899;
    --color-secondary-dark: #384566;
  }
`;

export default GlobalStyles;
