import React from 'react';
import Animated, {
  // @ts-ignore
  always,
} from 'react-native-reanimated';

export const useCodeExec = (
  nodeFactory: () => Animated.Node<any>,
  deps?: React.DependencyList,
) => {
  const handleRef = React.useRef<any>();

  const detach = () => {
    if (handleRef.current) {
      handleRef.current.__detach();
      handleRef.current = undefined;
    }
  };

  const attach = () => {
    detach();
    handleRef.current = always(nodeFactory());
    handleRef.current.__attach();
  };

  React.useEffect(() => {
    attach();

    return detach;
  }, deps);

  return {
    attach,
    detach,
  };
};
