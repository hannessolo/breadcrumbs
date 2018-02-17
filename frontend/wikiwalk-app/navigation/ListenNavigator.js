import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {StackNavigator} from 'react-navigation';
import ListenScreen from '../screens/ListenScreen.js';
import ListenDetailScreen from '../screens/ListenDetailScreen.js';
import PlaybackScreen from '../screens/PlaybackScreen.js';

const ListenStackNavigator = StackNavigator({
    ListenOverview: { screen: ListenScreen },
    ListenSpecific: { screen: ListenDetailScreen },
    ListenPlayback: { screen: PlaybackScreen},
  });

export default class ListenNavigator extends React.Component {

  static navigationOptions = {
    header: null
  };

  render() {
    return (<ListenStackNavigator />);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});