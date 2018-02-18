import React from 'react';
import { FlatList, Button, Text, ScrollView, StyleSheet, View } from 'react-native';
import { Permissions, Location } from 'expo';

export default class RecordScreen extends React.Component {
  static navigationOptions = {
    title: 'Record',
  };

  constructor(props) {
    super(props);

    this.state = {
      landmarks: [],
      location: null,
      errorMessage: null,
    }

    this.LANDMARKS_URL = "http://35.178.74.228:8080/landmarks";

  }

  async _getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location });

    if (location != null) {

      fetch(this.LANDMARKS_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      }),
      }).then((res) => {
        return res.json();
      }).then((res) => {
        this.setState({ landmarks: res["locations"] });
      }).catch((err) => {
        Alert.alert();
      });

    } else {
      Alert.alert("An error occured");
    }
    
  };

  componentWillMount() {

    this._getLocationAsync();

  }

  componentDidUpdate() {
    if (this.state.errorMessage != null) {
      Alert.alert(this.state.errorMessage)
    }
  }

  _keyExtractor(item, index) {
    return item.placeID;
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container} >
        <FlatList 
          data={this.state.landmarks}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) => (<View style={styles.row}>
            <Text style={{fontWeight: "bold", textAlign: "center"}}>{item.name}</Text>
            <Button title="View" onPress={() => navigate("RecordSpecific", {tour: item})}/>
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
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});