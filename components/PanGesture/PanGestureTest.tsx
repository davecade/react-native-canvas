import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const PanGestureTest = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const lastLocation = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);

  const color = useDerivedValue(() => {
    return translateY.value < 0 ? "pink" : "red";
  }, []);

  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      scale.value = 1.5;
    })
    .onBegin(() => {
      isDragging.value = true;
      lastLocation.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + lastLocation.value.x;
      translateY.value = event.translationY + lastLocation.value.y;
    })
    .onTouchesUp(() => {
      scale.value = 1;
      isDragging.value = false;
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(scale.value) },
        { rotate: withSpring(isDragging.value ? "180deg" : "0deg") },
      ],
      backgroundColor: withTiming(color.value),
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "orange" }} />
      <View style={{ flex: 1, backgroundColor: "blue" }} />
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              position: "absolute",
              top: "43%",
              bottom: "50%",
              left: "40%",
              height: 100,
              width: 100,
              borderRadius: 20,
            },
            rStyle,
          ]}
        />
      </GestureDetector>
    </View>
  );
};

export default PanGestureTest;

const styles = StyleSheet.create({});
