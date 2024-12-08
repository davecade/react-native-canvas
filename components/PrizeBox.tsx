import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withSpring,
} from "react-native-reanimated";
import BOX_IMAGE from "../assets/images/chest.jpg";
import PRIZE_IMAGE from "../assets/images/chest-open.jpg";

// Particle Component for Explosion Effect
const Particle: React.FC<{
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  opacity: Animated.SharedValue<number>;
  color: string;
}> = ({ x, y, opacity, color }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: color,
    borderRadius: 4,
    transform: [{ translateX: x.value }, { translateY: y.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle} />;
};

const PrizeBox: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  // Pre-create particles with shared values
  const particles = Array.from({ length: 50 }).map(() => {
    const colors = [
      "#FFD700", // Gold
      "#FF6347", // Tomato
      "#00FFFF", // Cyan
      "#FF4500", // Orange Red
      "#1E90FF", // Dodger Blue
    ];
    return {
      id: Math.random(),
      x: useSharedValue(0),
      y: useSharedValue(0),
      opacity: useSharedValue(1),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });

  // Shake animation values
  const shakeAnimation = useSharedValue(0);
  const explosionScale = useSharedValue(1);
  const boxRotation = useSharedValue(0);

  const createParticleExplosion = () => {
    particles.forEach((particle) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200 + 100; // 100-300 pixels

      // Animate each particle
      particle.x.value = withTiming(Math.cos(angle) * distance, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      particle.y.value = withTiming(Math.sin(angle) * distance, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      particle.opacity.value = withTiming(0, { duration: 800 });
    });

    // Reset particles after animation
    setTimeout(() => {
      particles.forEach((particle) => {
        particle.x.value = 0;
        particle.y.value = 0;
        particle.opacity.value = 1;
      });
    }, 1200);
  };

  const idleShakeStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withRepeat(
          withSequence(
            withTiming(-5, { duration: 50 }),
            withTiming(5, { duration: 50 })
          ),
          -1,
          true
        ),
      },
    ],
  }));

  const handleBoxPress = () => {
    if (isOpened) return;

    // Shake and explode animations
    shakeAnimation.value = withSequence(
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );

    explosionScale.value = withSequence(
      withSpring(1.2),
      withSpring(0, { damping: 2 })
    );

    boxRotation.value = withSequence(
      withTiming(20, { duration: 100 }),
      withTiming(-20, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    // Trigger particle explosion
    createParticleExplosion();

    // Open the box
    setTimeout(() => {
      setIsOpened(true);
    }, 500);
  };

  const boxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeAnimation.value },
      { scale: explosionScale.value },
      { rotate: `${boxRotation.value}deg` },
    ],
  }));

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <TouchableOpacity
        onPress={handleBoxPress}
        activeOpacity={0.7}
        disabled={isOpened}
      >
        {!isOpened ? (
          <Animated.View style={idleShakeStyle}>
            <Animated.Image
              source={BOX_IMAGE}
              style={[{ width: 200, height: 200 }, boxAnimatedStyle]}
              resizeMode="contain"
            />
          </Animated.View>
        ) : (
          <View
            style={{
              width: 200,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={PRIZE_IMAGE}
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Particle Explosion Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            opacity={particle.opacity}
            color={particle.color}
          />
        ))}
      </View>
    </View>
  );
};

export default PrizeBox;
