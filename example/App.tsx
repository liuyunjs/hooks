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
import { SafeAreaView, Button } from 'react-native';
import Animated, { useValue, call } from 'react-native-reanimated';
import { useSpring } from './lib/react-native-reanimated/useSpring';
import { useTiming } from './lib/react-native-reanimated/useTiming';
const App = () => {
  // const a = useValue<number>(0);
  const position = useValue(0);
  const velocity = useValue(0);
  const toValue = useValue<number>(0);
  // const { start, stop } = useTiming({
  //   position,
  //   duration: 3000,
  //   toValue,
  //   onUpdate(state) {
  //     return call([state.finished, state.position], (...args) => {
  //       console.log('onUpdate', args);
  //     });
  //   },
  //   onStart(state) {
  //     return call([state.finished, state.position], (...args) => {
  //       console.log('onStart', args);
  //     });
  //   },
  //   onEnd(state) {
  //     return call([state.finished, state.position], (...args) => {
  //       console.log('onEnd', args);
  //     });
  //   },
  // });
  const { start, stop } = useSpring({
    position,
    onUpdate(state) {
      return call([state.finished, state.position], (...args) => {
        console.log('onUpdate', args);
      });
    },
    onStart(state) {
      return call([state.finished, state.position], (...args) => {
        console.log('onStart', args);
      });
    },
    onEnd(state) {
      return call([state.finished, state.position], (...args) => {
        console.log('onEnd', args);
      });
    },
    damping: 2,
    stiffness: 10,
    velocity,
    toValue,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        title="开始"
        onPress={() => {
          toValue.setValue([start(), 1]);
        }}
      />
      <Button
        title="停止"
        onPress={() => {
          toValue.setValue(stop());
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
