import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen.js';
import ListenScreen from '../screens/ListenScreen.js';
import ListenNavigator from '../navigation/ListenNavigator.js';
import RecordNavigator from '../navigation/RecordNavigator.js';

export default TabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Listen: {
      screen: ListenNavigator,
    },
    Record: {
      screen: RecordNavigator,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName =
              Platform.OS === 'ios'
                ? `ios-map${focused ? '' : '-outline'}`
                : 'map';
            break;
          case 'Listen':
            iconName = Platform.OS === 'ios' ? `ios-megaphone${focused ? '' : '-outline'}` : 'ios-megaphone';
            break;
          case 'Record':
            iconName =
              Platform.OS === 'ios' ? `ios-recording${focused ? '' : '-outline'}` : 'record-voice-over';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
