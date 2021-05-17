import { useReactionRef } from './useReactionRef';

export const useReactionState = <S>(stateProps?: S | (() => S)) => {
  const [ref, setRef] = useReactionRef(stateProps);
  return [ref.value, setRef] as const;
};
