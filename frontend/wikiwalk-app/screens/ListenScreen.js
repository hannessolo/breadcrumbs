import React from 'react';
import { Button, View, ScrollView, StyleSheet, Text, Alert, FlatList } from 'react-native';
import { Permissions, Location } from 'expo';

export default class ListenScreen extends React.Component {
  static navigationOptions = {
    title: 'Listen',
  };

  constructor(props) {
    super(props);

    this.state = {
      landmarks: [],
      location: null,
      errorMessage: null,
    }

    this.LANDMARKS_URL = "http://demo5974750.mockable.io/location";

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
        this.setState({ landmarks: res["landmarks"] });
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container} >
        <FlatList 
          data={this.state.landmarks} 
          renderItem={({item}) => (<View style={styles.row}>
            <Text>{item}</Text>
            <Button title="View" onPress={() => navigate("ListenSpecific", {location: item})}/>
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
    backgroundColor: '#fff',
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'skyblue',
  },
});
