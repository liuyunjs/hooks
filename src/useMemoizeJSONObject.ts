import { useMemoize } from './useMemoize';

export const useMemoizeJSONObject = <S extends any>(
  input: S,
  level?: number,
) => {
  return useMemoize(() => input, input, level);
};
