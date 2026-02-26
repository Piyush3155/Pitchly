import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect } from "react";
import { StyleSheet, ViewProps } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from "react-native-reanimated";

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
  ...props
}: SkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const baseBackgroundColor = isDark ? "#374151" : "#E5E7EB"; // gray-700 : gray-200

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseBackgroundColor,
        },
        animatedStyle,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({});
