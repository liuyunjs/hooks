import { useReactionRef } from './useReactionRef';

export const useReactionState = <S extends any>(input: S) => {
  const [ref, set] = useReactionRef(input);
  return [ref.current, set] as const;
};
