import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type AnimatedCardProps = {
  children: React.ReactNode;
  index?: number;
  style?: any;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, index = 0, style }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(index * 50, withSpring(0, { damping: 15, stiffness: 100 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedCard;
