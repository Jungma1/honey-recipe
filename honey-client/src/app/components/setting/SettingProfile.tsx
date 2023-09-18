import styled from '@emotion/styled';
import { rem } from 'polished';
import SettingProfileImage from './SettingProfileImage';
import SettingProfileRows from './SettingProfileRows';

function SettingProfile() {
  return (
    <Block>
      <SettingProfileImage />
      <SettingProfileRows />
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(64)};
`;

export default SettingProfile;
