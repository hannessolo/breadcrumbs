import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {StackNavigator} from 'react-navigation';
import RecordScreen from '../screens/RecordScreen.js';
import RecordDetailScreen from '../screens/RecordDetailScreen.js';

const RecordStackNavigator = StackNavigator({
    RecordOverview: { screen: RecordScreen },
    RecordSpecific: { screen: RecordDetailScreen },
  });

export default class ListenNavigator extends React.Component {

  static navigationOptions = {
    header: null
  };

  render() {
    return (<RecordStackNavigator />);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});