import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedBox = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          rotate: `${rotate.value}deg`,
        },
      ],
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        onTouchStart={() => {
          scale.value = withTiming(1.5);
          rotate.value = withRepeat(withTiming(180), 4);
        }}
        onTouchEnd={() => {
          scale.value = withTiming(1);
          rotate.value = withTiming(0);
        }}
        style={[styles.box, animatedStyle]}
      ></Animated.View>
    </View>
  );
};

export default AnimatedBox;

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#78CAD2",
    height: 100,
    width: 100,
    borderRadius: 20,
  },
});
