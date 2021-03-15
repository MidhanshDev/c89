import React from "react";
import { AppStackNavigator } from "./AppStackNavigator";
import BookRequestScreen from "../screens/BookRequest";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Image } from "react-native";
export const AppTabNavigator = createBottomTabNavigator({
  DonateBooks: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/request-list.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Donate Books",
    },
  },
  BookRequestScreen: {
    screen: BookRequestScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/request-book.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Book Request",
    },
  },
});
