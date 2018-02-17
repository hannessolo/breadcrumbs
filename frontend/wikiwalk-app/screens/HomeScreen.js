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

    this.state = {
      location: null,
      errorMessage: null,
    }

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