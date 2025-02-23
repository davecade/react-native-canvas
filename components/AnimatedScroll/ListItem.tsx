import { View, ViewToken } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type listProps = {
  item: { id: number };
  viewableItems: SharedValue<ViewToken[]>;
};

const ListItem = ({ item, viewableItems }: listProps) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => !!item.isViewable)
        .find((viewableItem) => viewableItem.item.id === item.id)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [{ scale: withTiming(isVisible ? 1 : 0.5) }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 80,
          width: "90%",
          backgroundColor: "#78CAD2",
          marginTop: 20,
          borderRadius: 15,
          marginLeft: "5%",
        },
        rStyle,
      ]}
    />
  );
};

export default ListItem;
