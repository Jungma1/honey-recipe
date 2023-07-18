export const upload = () => {
  return new Promise<File | null>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = (e) => {
      if (!input.files) return;
      const file = input.files[0];
      resolve(file);
    };
    input.click();
  });
};
