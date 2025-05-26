import { StyleSheet } from "react-native";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const circleRadiius = 30;

const SpacialTapGesture = () => {
  const left = useSharedValue(0);
  const top = useSharedValue(0);
  const scale = useSharedValue(0);

  const prevuiousLeft = useSharedValue(0);
  const prevuiousTop = useSharedValue(0);

  const tapGesture = Gesture.Tap().onBegin((event) => {
    // We first set the previous position to the current position
    prevuiousLeft.value = left.value;
    prevuiousTop.value = top.value;

    // Set the position of the circle to the tap location minus the radius
    left.value = event.x - circleRadiius;
    top.value = event.y - circleRadiius;
  });

  useAnimatedReaction(
    () => {
      return left.value; // the value you check for changes
    },
    (curr, prev) => {
      if (curr !== prev && curr !== 0) {
        // we do curr !== 0 to avoid the initial animation
        cancelAnimation(scale); // when the value changes, cancel the previous animation
        scale.value = 0;
        scale.value = withSpring(1, { mass: 0.5 });
      }
    }
  );

  // We create an animated style for the circle
  // This is used to animate the position and scale of the circle
  const rStyle = useAnimatedStyle(() => {
    return {
      left: left.value,
      top: top.value,
      transform: [{ scale: scale.value }],
    };
  }, []);

  // We create a separate animated style for the previous position
  // This is used to animate the previous position of the second circle
  const rPrevStyle = useAnimatedStyle(() => {
    return {
      left: prevuiousLeft.value,
      top: prevuiousTop.value,
    };
  }, []);

  // For the magic circle animation
  // We use useDerivedValue to create an animated value that will be used for the magic circle
  // We use withTiming to animate the position of the magic circle
  // We use Easing.inOut(Easing.quad) to create a smooth animation
  const animatedLeft = useDerivedValue(() => {
    return withTiming(left.value, {
      duration: 1000,
      easing: Easing.inOut(Easing.quad),
    });
  });
  const animatedTop = useDerivedValue(() => {
    return withTiming(top.value, {
      duration: 1000,
      easing: Easing.inOut(Easing.quad),
    });
  });

  const rMagicCircleStyle = useAnimatedStyle(() => {
    return {
      left: animatedLeft.value,
      top: animatedTop.value,
    };
  }, []);

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={styles.container}>
        <StatusBar style="light" />
        <Animated.View style={[styles.baseCircle, rStyle]} />
        <Animated.View style={[styles.baseCircle, rPrevStyle]} />
        <Animated.View
          style={[
            styles.baseCircle,
            {
              backgroundColor: "blue",
            },
            rMagicCircleStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default SpacialTapGesture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  baseCircle: {
    width: circleRadiius * 2,
    height: circleRadiius * 2,
    borderRadius: circleRadiius,
    backgroundColor: "#2f2f2f",
    position: "absolute",
  },
});
