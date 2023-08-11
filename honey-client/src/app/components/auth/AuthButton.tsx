import styled from '@emotion/styled';
import { rem } from 'polished';
import { colors } from '~/utils/colors';
import { GoogleIcon, KakaoIcon, NaverIcon } from '../vector';

interface Props {
  provider: 'google' | 'kakao' | 'naver';
}

const providerObject = {
  google: {
    icon: GoogleIcon,
    fontColor: colors.gray9,
    background: colors.white,
    text: '구글',
  },
  kakao: {
    icon: KakaoIcon,
    fontColor: colors.gray9,
    background: 'yellow',
    text: '카카오',
  },
  naver: {
    icon: NaverIcon,
    fontColor: colors.white,
    background: '#02bb6b',
    text: '네이버',
  },
};

function AuthButton({ provider }: Props) {
  const host = process.env.NEXT_PUBLIC_API_URL;
  const path = `${host}/api/v1/auth/oauth/${provider}`;
  const { icon: Icon, background, fontColor, text } = providerObject[provider];

  return (
    <Anchor href={path}>
      <StyledButton background={background}>
        <IconWrapper>
          <Icon />
        </IconWrapper>
        <Text fontColor={fontColor}>{text} 로그인</Text>
      </StyledButton>
    </Anchor>
  );
}

const Anchor = styled.a`
  width: 100%;
`;

const StyledButton = styled.button<{ background: string }>`
  position: relative;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${rem(4)};
  border: 2px solid ${colors.gray0};
  background-color: ${(props) => props.background};
  cursor: pointer;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${rem(16)};
  display: flex;
`;

const Text = styled.strong<{ fontColor: string }>`
  color: ${colors.gray9};
  font-size: ${rem(18)};
  color: ${(props) => props.fontColor};
`;

export default AuthButton;
