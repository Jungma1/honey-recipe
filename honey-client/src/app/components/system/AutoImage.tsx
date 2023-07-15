import Image, { ImageProps } from 'next/image';

interface Props extends Omit<ImageProps, 'width' | 'height' | 'alt'> {}

function AutoImage({ ...rest }: Props) {
  return (
    <Image
      {...rest}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      alt=""
    />
  );
}

export default AutoImage;
