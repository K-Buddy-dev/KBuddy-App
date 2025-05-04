import { createContext, ReactNode, useContext, useState } from "react";

interface PhotoContextType {
  limit: number;
  setLimit: (limit: number) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [limit, setLimit] = useState<number>(1);

  return (
    <PhotoContext.Provider value={{ limit, setLimit }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhoto must be used within a PhotoProvider");
  }
  return context;
};
