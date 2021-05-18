import { useWillMount } from './useWillMount';

export const useConst = <T>(input: T) => {
  return useWillMount(() => input);
};
