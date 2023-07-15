import { useState } from 'react';

export function useImageFileSelector() {
  const [imagePath, setImagePath] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const openImageFileSelector = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = (e) => {
      if (!input.files) return;

      const file = input.files[0];
      const fileURL = URL.createObjectURL(file);
      setImageFile(file);
      setImagePath(fileURL);
    };
    input.click();
  };

  const handleClickImageFileSelector = (e: React.MouseEvent) => {
    e.preventDefault();
    openImageFileSelector();
  };

  return { imagePath, imageFile, handleClickImageFileSelector };
}
