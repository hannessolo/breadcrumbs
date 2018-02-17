import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class ListenDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Listen Detail',
  };

  constructor(props) {
    super(props);
    this.state = {
      tours: [],
      location: null,
      errorMessage: null,
    }

    this.TOURS_URL = "";

  }

  componentWillMount() {
    this._getData();
  }

  _getData() {
    
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          {this.props.location}
        </Text>
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});