export const redirect = async (path: string) => {
  return {
    redirect: {
      destination: path,
      permanent: false,
    },
  };
};
