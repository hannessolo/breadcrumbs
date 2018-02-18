import React from 'react';
import { MapView, Permissions, Location } from 'expo';
import { View, Alert, Text } from 'react-native';

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
    }

  }

  componentWillMount() {
    console.log("Lolol")
    this._getLocationAsync();
  }

  componentDidUpdate() {
    if (this.state.errorMessage != null) {
      Alert.alert(this.state.errorMessage);
    }
  }

  async _getLocationAsync() {
    console.log("entered function")
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log("Failed")
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    console.log("got perm")
    let location = await Location.getCurrentPositionAsync({});
    console.log(location.coords.longitude)
    this.setState({ location: location });
  };

  render () {

    if (this.state.location != null) {
      return (
        <MapView style={{flex: 1}} initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}/>
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