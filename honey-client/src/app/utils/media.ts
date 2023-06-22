const mediaQueries = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
} as const;

type MediaQueriesName = keyof typeof mediaQueries;
type Media = Record<MediaQueriesName, string>;

const createMediaQuery = (width: number) => `
  @media (max-width: ${width}px)
`;

/**
 * acc: Media -> initialValue -> {} as Media
 * [key: string, value: number] -> currentValue -> mediaQueries
 */
export const media = Object.entries(mediaQueries).reduce((acc, [key, value]) => {
  acc[key as MediaQueriesName] = createMediaQuery(value);
  return acc;
}, {} as Media);
