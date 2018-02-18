import React from 'react';
import { MapView, Permissions, Location } from 'expo';
import { View, Text } from 'react-native';
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

  componentDidMount() {
    console.log("mountmi")
    this._getLocationAsync();
  }

  componentDidUpdate() {
    if (this.state.errorMessage != null) {
    }
  }

  
  async _getLocationAsync() {
    console.log("waiting for perms")
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log("perms gotten")
    if (status !== 'granted') {
      console.log(status)
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    console.log(status)
    let location = await Location.getCurrentPositionAsync({maximumAge : 100000});
    console.log(location)
    this.setState({ location: location });

    if (location != null) {

      console.log("Will fetch now memes");
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
        console.log("memes fetched");
      }).catch((err) => {
      });

    } else {
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
            key={Math.random()}
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