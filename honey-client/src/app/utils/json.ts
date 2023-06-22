import { GetServerSidePropsResult } from 'next';

export const json = async <T>(data: T): Promise<GetServerSidePropsResult<T>> => {
  return { props: data };
};
