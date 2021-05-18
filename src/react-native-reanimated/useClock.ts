import { Clock } from 'react-native-reanimated';
import { useWillMount } from '../useWillMount';

const createClock = () => new Clock();

export const useClock = () => useWillMount(createClock);
