import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import {Audio} from 'expo';

export default class PlaybackScreen extends React.Component {
  static navigationOptions = {
    title: 'Playback',
  };

  constructor(props) {
        super(props);
        this.state = { isPlayingAudio: false, text: "Is Playing Audio" }
        this._onButtonPress = this._onButtonPress.bind(this);
        this.audio = new Audio.Sound();
        this.item = this.props.navigation.state.params.tour;
    }

    componentDidMount() {
        let url = "http://35.178.74.228:8080/static/" + this.item.filepath
        this.audio.loadAsync({uri: url});

    }

    componentDidUpdate() {
        try {
            if (this.state.isPlayingAudio) {
                this.audio.playAsync();
            } else {
                this.audio.pauseAsync();
            }
        } catch (error) {

        }
    }


    _onButtonPress() {
        this.setState(prev => {
            return { isPlayingAudio: !prev.isPlayingAudio }
        })
    }

  render() {
      return (

          <View>
              <Button onPress={this._onButtonPress} title="Button"/>
              <Text>{this.state.isPlayingAudio && this.state.text}</Text>
          </View>

      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});