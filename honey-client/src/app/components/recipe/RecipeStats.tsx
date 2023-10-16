import styled from '@emotion/styled';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { rem } from 'polished';
import { colors } from '~/utils/colors';
import { formatDate, formatNumber } from '~/utils/format';

interface Props {
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isPrivate: boolean;
}

function RecipeStats({ createdAt, likeCount, commentCount, isPrivate }: Props) {
  return (
    <Block>
      {isPrivate && <Private>비공개</Private>}
      <CreatedAt>{formatDate(createdAt)}</CreatedAt>
      <Stat>
        <FavoriteRoundedIcon />
        <span>{formatNumber(likeCount)}</span>
      </Stat>
      <Stat>
        <ForumRoundedIcon />
        <span>{formatNumber(commentCount)}</span>
      </Stat>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(16)};
  color: ${colors.gray6};
`;

const CreatedAt = styled.div`
  color: ${colors.gray6};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(4)};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Private = styled.div`
  padding: ${rem(2)} ${rem(8)};
  border-radius: ${rem(4)};
  font-size: ${rem(14)};
  color: ${colors.white};
  background: ${colors.gray3};
`;

export default RecipeStats;
