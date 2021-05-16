import { Dimensions } from 'react-native';

export const TRUE = 1;
export const FALSE = 0;
export const NOOP = 0;

export const DEFAULT_HANDLE = () => NOOP;

export const WIDTH = Dimensions.get('window').width;

export type TrueOrFalse = 0 | 1;
