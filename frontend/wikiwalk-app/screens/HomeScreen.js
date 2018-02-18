import React from 'react';
import { MapView, Permissions, Location } from 'expo';
import { View, Alert, Text } from 'react-native';
import { Marker } from 'react-native-maps';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    console.log("constructor")

    this.state = {
      location: null,
      errorMessage: null,
      landmarks: []
    }

    this.LANDMARKS_URL = "http://35.178.74.228:8080/landmarks";

  }

  componentWillMount() {
    this._getLocationAsync();
  }

  componentDidUpdate() {
    if (this.state.errorMessage != null) {
      Alert.alert(this.state.errorMessage);
    }
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

  render () {

    if (this.state.location != null) {
      return (
        <MapView style={{flex: 1}} initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0230,
            longitudeDelta: 0.0105,
        }}> 

        {this.state.landmarks.map(marker => (
          <Marker
            coordinate={{
              latitude: marker.lat,
              longitude: marker.lon
            }}
            title={marker.name}
            description=""
          />
        ))}

        </MapView>
        );
    } else {
      return (
      <View>
        <Text>Loading...</Text>        
      </View>
      );

    }

    
  }

}