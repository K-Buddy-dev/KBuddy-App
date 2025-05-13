import { useEffect, useRef } from "react";

const useDidUpdate = (callback: () => void, deps: any[]) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      callback();
    }
  }, deps);
};

export default useDidUpdate;
