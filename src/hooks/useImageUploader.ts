import { useState, useCallback } from 'react';

export const useImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  }, []);

  return { image, handleImageUpload };
};