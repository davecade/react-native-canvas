import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import React from "react";
import ListItem from "./ListItem";
import Animated, { useSharedValue } from "react-native-reanimated";

const data = new Array(50).fill(0).map((_, index) => ({ id: index }));

const AnimatedScroll = () => {
  const viewableItems = useSharedValue<ViewToken[]>([]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={{
          paddingTop: 40,
        }}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems
            .filter((item) => item.isViewable)
            .map((item) => item);
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return <ListItem item={item} viewableItems={viewableItems} />;
        }}
      />
    </View>
  );
};

export default AnimatedScroll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
