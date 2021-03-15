import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingScreen from "../screens/SettingScreen";
import MyDonationsScreen from "../screens/MyDonationScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MyReceievdBooksScreen from "../screens/MyReceivedBooksScreen";
import { Icon } from "react-native-elements";
export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="fontawesome5" />,
      },
    },
    MyDonations: {
      screen: MyDonationsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel:"My Donations"
      },
    },
    Notifications: { screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel:"Notifications"
      },
    },
    MyReceievdBooks: { screen: MyReceievdBooksScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel:"My Received Books"
      },
    },
    Settings: { screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="Ionicons" />,
        drawerLabel:"Settings"
      },
    },
  },
  { contentComponent: CustomSideBarMenu },
  { initialRouteName: "Home" }
);
