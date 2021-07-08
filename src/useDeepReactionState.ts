import { useDeepReactionRef } from './useDeepReactionRef';

export const useDeepReactionState = <S>(input?: S | (() => S)) => {
  const [ref, setRef] = useDeepReactionRef(input);
  return [ref.current, setRef] as const;
};
