import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { rem } from 'polished';
import { useMotionHorizontal } from '~/hooks/useMotionHorizontal';
import { colors } from '~/utils/colors';

function RecipeItem() {
  const { x, handleMouseEnter, handleMouseLeave } = useMotionHorizontal(10, false);

  return (
    <Block onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} animate={{ x }}>
      <ImageWrapper>
        <TagBlock>디저트</TagBlock>
        <Image
          src="/test.png"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          alt=""
        />
      </ImageWrapper>
      <Wrapper>
        <Title>요리 비법 전수해드림</Title>
        <Description>
          이건 제목이 아닌 미리보기 인데요. 저도 뭐라 하는지 모르겠어요.이건 제목이 아닌 미리보기
          인데요. 저도 뭐라 하는지 모르겠어요.이건 제목이 아닌 미리보기 인데요. 저도 뭐라 하는지
          모르겠어요.이건 제목이 아닌 미리보기 인데요. 저도 뭐라 하는지 모르겠어요.이건 제목이 아닌
          미리보기 인데요. 저도 뭐라 하는지 모르겠어요.이건 제목이 아닌 미리보기 인데요. 저도 뭐라
          하는지 모르겠어요.이건 제목이 아닌 미리보기 인데요. 저도 뭐라 하는지 모르겠어요.이건
          제목이 아닌 미리보기 인데요. 저도 뭐라 하는지 모르겠어요.이건 제목이 아닌 미리보기 인데요.
          저도 뭐라 하는지 모르겠어요.이건 제목이 아닌 미리보기 인데요. 저도 뭐라 하는지
          모르겠어요.이건 제목이 아닌 미리보기 인데요. 저도 뭐라 하는지 모르겠어요.이건 제목이 아닌
          미리보기 인데요. 저도 뭐라 하는지 모르겠어요.
        </Description>
        <FooterWrapper>
          <div>2023년 6월 21일 토요일</div>
          <WriterWrapper>
            <div>ㅇ</div>
            <div>by. 모코코</div>
          </WriterWrapper>
        </FooterWrapper>
      </Wrapper>
    </Block>
  );
}

const Block = styled(motion.div)`
  display: flex;
  gap: ${rem(16)};
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`;

const TagBlock = styled.div`
  position: absolute;
  bottom: ${rem(8)};
  left: ${rem(8)};
  padding: ${rem(4)} ${rem(8)};
  font-weight: 500;
  border-radius: ${rem(5)};
  color: ${colors.white};
  background-color: ${colors.primary};
  box-shadow: 0 ${rem(2)} ${rem(4)} rgba(0, 0, 0, 0.5);
`;

const Wrapper = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  margin: ${rem(16)} 0;
`;

const Title = styled.div`
  font-size: ${rem(18)};
  font-weight: 500;
  color: ${colors.gray9};
  margin-bottom: ${rem(8)};
`;

const Description = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-size: ${rem(16)};
  color: ${colors.gray4};
`;

const FooterWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: ${rem(16)};
  color: ${colors.gray9};
`;

const WriterWrapper = styled.div`
  display: flex;
`;

export default RecipeItem;
