import { Clock } from 'react-native-reanimated';
import { useWillMount } from 'react-will-mount-hook';

const createClock = () => new Clock();

export const useClock = () => useWillMount(createClock);
