export const handleSelectImage = (
  setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>,
  limit: number,
  id: string
) => {
  setSelectedPhotos((prev) => {
    const isSelected = prev.includes(id);

    if (isSelected) {
      return prev.filter((photoId) => photoId !== id);
    }

    if (prev.length >= limit) {
      return prev;
    }

    return [...prev, id];
  });
};
