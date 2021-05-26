/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import Animated, { useValue } from 'react-native-reanimated';
import { useSpring } from './lib/react-native-reanimated/useSpring';
import { useTiming } from './lib/react-native-reanimated/useTiming';
import { useConst } from './lib/useConst';
const App = () => {
  const a = useValue<number>(0);
  const position = useValue(0);
  const velocity = useValue(0);
  // const { start, stop } = useTiming({
  //   position,
  //   config: useConst({
  //     duration: 3000,
  //   }),
  // });
  const { start, stop } = useSpring({
    position,
    // config: {
    //   duration: 3000,
    // },
    config: useConst({
      damping: 2,
      stiffness: 10,
    }),
    velocity,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        title="开始"
        onPress={() => {
          a.setValue(start(1));
        }}
      />
      <Button
        title="停止"
        onPress={() => {
          a.setValue(stop());
        }}
      />
      <Animated.View
        style={{
          backgroundColor: 'red',
          opacity: position,
          width: 100,
          height: 100,
        }}
      />
    </SafeAreaView>
  );
};

export default App;
