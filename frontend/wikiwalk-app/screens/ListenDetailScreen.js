import React from 'react';
import { Text, View, ScrollView, Button, FlatList, StyleSheet } from 'react-native';

export default class ListenDetailScreen extends React.Component {
  static navigationOptions = {
    title: "Detail",
  };

  constructor(props) {
    super(props);
    this.state = {
      tours: [],
      errorMessage: null,
    }

    this.TOURS_URL = "http://35.178.74.228:8080/tours";

  }

  componentWillMount() {
    this._getData();
  }

  _getData() {
    fetch(this.TOURS_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        placeID: this.props.navigation.state.params.location.placeID,
        placeName: this.props.navigation.state.params.location.name
      }),
    }
    ).then((res) => {
      return res.json();
    }).then((res) => {
      this.setState({
        tours: res.tours
      })
    })
  }

  _keyExtractor(item, index) {
    return item.id
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container} >
        <FlatList 
          data={this.state.tours}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) => (<View style={styles.row}>
            <Text>{item.title}</Text>
            <Button title="View" onPress={() => navigate("ListenPlayback", {tour: item})}/>
          </View>)}
        /> 
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#eee',
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
});