import React from 'react';
import { View, ScrollView, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo';

export default class RecordDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Record',
  };

  constructor(props) {
    super(props);
    this.state = { isRecordingAudio: false, isPlayingAudio: false, text: "Is Playing Audio" }
    this._onRecordButtonPress = this._onRecordButtonPress.bind(this);
    this.audio = new Audio.Sound();
    this.recording = new Audio.Recording();
    this.item = this.props.navigation.state.params.tour;
  }

  ComponentDidUpdate() {
    if (this.state.isPlayingAudio) {
      this._startRecording();
    } else {
      this._stopRecording();
    }
  }

  async _startRecording() {
    try {
      await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY);
      await this.recording.startAsync();
      // You are now recording!
    } catch (error) {
      // An error occurred!
    }
  }

  async _stopRecording() {
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {

    }
  }

  _onRecordButtonPress() {
    this.setState(prev => {
      return {
        isRecordingAudio: !prev.isRecordingAudio
      }
    })
  }

  render() {
    return <View>
      <Button title="Record Me"
      onPress={this._onRecordButtonPress}/>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});