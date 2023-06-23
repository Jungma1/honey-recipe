import styled from '@emotion/styled';
import { rem } from 'polished';
import { colors } from '~/utils/colors';
import { GoogleIcon, KakaoIcon, NaverIcon } from '../vector';

interface Props {
  provider: 'google' | 'kakao' | 'naver';
}

const iconMap = {
  google: GoogleIcon,
  kakao: KakaoIcon,
  naver: NaverIcon,
};

const iconBackgroundMap = {
  google: colors.white,
  kakao: 'yellow',
  naver: '#00B06F',
};

const iconTextMap = {
  google: '구글',
  kakao: '카카오',
  naver: '네이버',
};

function AuthButton({ provider }: Props) {
  const host = process.env.NEXT_PUBLIC_API_URL;
  const path = `${host}/api/v1/auth/oauth/${provider}`;
  const Icon = iconMap[provider];
  const iconBackground = iconBackgroundMap[provider];
  const iconText = iconTextMap[provider];

  return (
    <Anchor href={path}>
      <StyledButton background={iconBackground}>
        <IconWrapper>
          <Icon />
        </IconWrapper>
        <Text>{iconText} 로그인</Text>
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
  border-radius: 5px;
  background-color: ${(props) => props.background};
  cursor: pointer;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${rem(16)};
  display: flex;
`;

const Text = styled.strong`
  color: ${colors.gray9};
  font-size: ${rem(18)};
`;

export default AuthButton;
