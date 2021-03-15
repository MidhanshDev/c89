import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from "./screens/LoginScreen";
import {AppDrawerNavigator} from "./components/AppDrawerNavigator";
import {createAppContainer,createSwitchNavigator} from 'react-navigation';


export default function App (){
  return (
    
     <AppContainer/>
    
  );
}
const switchNavigator = createSwitchNavigator({
WelcomeScreen:{screen:LoginScreen},
Drawer:{screen:AppDrawerNavigator},
});
const AppContainer = createAppContainer(switchNavigator)


