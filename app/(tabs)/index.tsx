import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PrizeBox from "@/components/PrizeBox";
import { AppleInvites } from "@/components/AppleInvites";
import AiPlaygroundHome from "@/components/AiPlaygroundHome";
import AnimatedScroll from "@/components/AnimatedScroll/AnimatedScroll";
import AnimatedBox from "@/components/AnimatedBox/AnimatedBox";
import PanGesture from "@/components/PanGesture/PanGesture";
import PanGestureTest from "@/components/PanGesture/PanGestureTest";

export default function HomeScreen() {
  // return <PanGesture />;
  return <PanGestureTest />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
