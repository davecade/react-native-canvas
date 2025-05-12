import { StyleSheet, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SQUARE_SIZE = 120;

const PanGesture = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // This is used to store the last position of the square when the gesture starts
  // so that it does not go back to the original position when the gesture starts
  const lastXYValue = useSharedValue({ x: 0, y: 0 });

  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      lastXYValue.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      {
        translateX.value = event.translationX + lastXYValue.value.x;
        translateY.value = event.translationY + lastXYValue.value.y;
      }
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  // Rotate the square while we are dragging it
  // We use the useDerivedValue when we need to determine the value of a shared value
  // based on another shared value
  const rotate = useDerivedValue(() => {
    return withSpring(isDragging.value ? "180deg" : "0deg");
  }, []);

  const scale = useDerivedValue(() => {
    return withSpring(isDragging.value ? 0.8 : 1);
  }, []);

  const color = useDerivedValue(() => {
    const isInTheWhiteArea = translateY.value < 0;

    if (isInTheWhiteArea) {
      return "black";
    }

    return "white";
  }, []);

  const animatedColor = useDerivedValue(() => {
    return withTiming(color.value);
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: rotate.value },
        { scale: scale.value },
      ],
      backgroundColor: animatedColor.value,
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.square, rStyle]} />
      </GestureDetector>

      <View style={styles.background} />
    </View>
  );
};

export default PanGesture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: "#78CAD2",
    borderRadius: 30,
    zIndex: 2,
  },
  background: {
    position: "absolute",
    top: "50%",
    left: 0,
    height: "50%",
    width: "100%",
    backgroundColor: "black",
    zIndex: 1,
  },
});
