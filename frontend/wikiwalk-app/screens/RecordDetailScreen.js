import React from 'react';
import { Alert, Text, View, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { Audio, FileSystem, MailComposer } from 'expo';
import { Ionicons } from '@expo/vector-icons';

export default class RecordDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Record',
  };

  constructor(props) {
    super(props);
    this.state = { 
      isRecordingAudio: false, 
      isPlayingAudio: false, 
      text: "Is Playing Audio",
      title: "Title Here"
    }
    this._onRecordButtonPress = this._onRecordButtonPress.bind(this);
    this.audio = new Audio.Sound();
    this.recording = new Audio.Recording();
    this.item = this.props.navigation.state.params.tour;

    this.SAVE_FILE_URL = "http://35.178.74.228:8080/newEntry"

  }

  async componentWillMount() {
    console.log("enableing audio");
    console.log(FileSystem.documentDirectory);
    console.log(FileSystem.cacheDirectory);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
  }

  async _startRecording() {
    this.recording = new Audio.Recording();
    try {
      await this.recording.prepareToRecordAsync(RECORDING_OPTIONS_PRESET_LOW_QUALITY);
      await this.recording.startAsync();
      // You are now recording!
    } catch (error) {
      console.log(error)
    }
  }

  async _stopRecording() {
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {

    }

    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);

    console.log(info.uri);

    const formData = new FormData()
    formData.append('file', {
      uri: info.uri,
      name: "recording.m4a",
      type: "audio/m4a"
    }
    );

    console.log(formData)
    fetch(this.SAVE_FILE_URL, {
      headers: {
        placeID: this.item.placeID,
        tourTitle: this.state.title,
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST',
      body: formData,
    }).then(res => console.log(res))
    .catch(err => console.log(err))

    await FileSystem.deleteAsync(this.recording.getURI())
  }

  _onRecordButtonPress() {

    let isRecordingAudio = !this.state.isRecordingAudio;

    if (isRecordingAudio) {
      this._startRecording();
    } else {
      this._stopRecording();
    }
    this.setState(prev => {
      return {
        isRecordingAudio: !prev.isRecordingAudio
      }
    })
  }

  render() {
    return <View>
      <Text style={styles.title}>New Recording</Text>
      <Button title="Record Me"
      onPress={this._onRecordButtonPress}/>
      <View style={styles.iconContainer}>{this.state.isRecordingAudio ? 
        <Ionicons size={32} name="ios-mic"/> : <Ionicons name="ios-mic-off" size={32}/>}</View>
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1, padding: 5, margin: 20}}
        onChangeText={(title) => this.setState({title})}
        value={this.state.title}
      />
    </View>
  }
}

const RECORDING_OPTIONS_PRESET_LOW_QUALITY: RecordingOptions = {
  android: {
    extension: '.3gp',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 96400,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },title: {
    textAlign: 'center',
    padding: 20,
    fontSize: 30,
    fontWeight: 'bold'
  },iconContainer: {
    flexDirection: "row",
    justifyContent: "center"
  }
});