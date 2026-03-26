import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';

interface LogButtonProps {
  onPress: () => void;
  isLogged: boolean;
  isLoading?: boolean;
}

/**
 * LogButton — The primary CTA button.
 * Animates with a "pop" spring on press and transitions to a "Done" state
 * once the user has logged today. Uses react-native-reanimated for smooth animation.
 */
export const LogButton: React.FC<LogButtonProps> = ({
  onPress,
  isLogged,
  isLoading = false,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Transition animation when isLogged changes to true
  useEffect(() => {
    if (isLogged) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 4, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 150 })
      );
    }
  }, [isLogged]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (isLogged || isLoading) return;

    // Quick bounce on press
    scale.value = withSequence(
      withSpring(0.92, { damping: 5, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );
    opacity.value = withSequence(
      withTiming(0.8, { duration: 80 }),
      withTiming(1, { duration: 120 })
    );

    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.button,
          isLogged ? styles.buttonLogged : styles.buttonActive,
        ]}
        onPress={handlePress}
      >
        <Text
          style={[styles.buttonText, isLogged && styles.buttonTextLogged]}
        >
          {isLogged ? (
            <><FontAwesome5 name="check-circle" size={20} />  Logged Today!</>
          ) : isLoading ? (
            'Logging...'
          ) : (
            <><FontAwesome5 name="fire" size={20} />  Log Today</>
          )}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    shadowOpacity: 0.25,
    elevation: 8,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
  },
  buttonLogged: {
    backgroundColor: Colors.successLight,
    shadowColor: Colors.success,
    elevation: 2,
  },
  buttonText: {
    ...Typography.titleLarge,
    color: Colors.textOnPrimary,
    textAlign: 'center',
    paddingVertical: Spacing.xs,
  },
  buttonTextLogged: {
    color: Colors.success,
  },
});
