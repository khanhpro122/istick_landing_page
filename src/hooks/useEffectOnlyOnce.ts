// Libraries
import { useEffect, useState } from 'react';

export const useEffectOnlyOnce = (fn: Function, dependencies: any[]) => {
  const [didLoad, setDidLoad] = useState<boolean>(false);

  useEffect(() => {
    if (!didLoad) {
      fn();
      setDidLoad(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
};
