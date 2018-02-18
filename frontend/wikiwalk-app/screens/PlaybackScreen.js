import React from 'react';
import { View, StyleSheet, Button, Text, TouchableHighlight } from 'react-native';
import { Audio, MapView } from 'expo';
import { Ionicons } from '@expo/vector-icons';

export default class PlaybackScreen extends React.Component {
  static navigationOptions = {
    title: 'Playback',
  };

  constructor(props) {
        super(props);
        this.state = { 
          isPlayingAudio: false, 
          text: "Is Playing Audio",
          upvotes: 0
        }
        this._onButtonPress = this._onButtonPress.bind(this);
        this._onUpvote = this._onUpvote.bind(this);
        this._onDownvote = this._onDownvote.bind(this);
        this.audio = new Audio.Sound();
        this.item = this.props.navigation.state.params.tour;
    }

    async componentDidMount() {
        let url = "http://35.178.74.228:8080/static/" + this.item.filepath
        console.log(url)
        try {
          await this.audio.loadAsync({uri: url});
        } catch (err) {
          console.log(err)
        }

    }

    componentWillMount() {
      this.setState({
        upvotes: this.item.rating
      });
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

    _onUpvote() {
      upvotes = this.state.upvotes + 1
      this.setState({
        upvotes: upvotes
      })
      fetch("http://35.178.74.228:8080/tours/" + this.props.navigation.state.params.loc + "/" + this.item.id + "/up")
    }

    _onDownvote() {
      upvotes = this.state.upvotes - 1
      this.setState({
        upvotes: upvotes
      })
      fetch("http://35.178.74.228:8080/tours/" + this.props.navigation.state.params.loc + "/" + this.item.id + "/down")
    }


    _onButtonPress() {
        this.setState(prev => {
            return { isPlayingAudio: !prev.isPlayingAudio }
        })
    }

  render() {
      return (

          <View>
              <Text style={styles.title}>{this.item.title}</Text>
              <Button style={styles.buttonStyle} onPress={this._onButtonPress} title="Play Recording"/>
              <View style={styles.votePanel}>

                <Text style={{fontSize: 18}}>Upvotes: {this.state.upvotes}</Text>
                <View>
                  <TouchableHighlight onPress={this._onUpvote}>
                    <Ionicons size={32} name="ios-arrow-up"/>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this._onDownvote}>
                    <Ionicons size={32} name="ios-arrow-down"/>
                  </TouchableHighlight>
                </View>

              </View>
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
  title: {
    textAlign: 'center',
    padding: 20,
    fontSize: 30,
    fontWeight: 'bold'
  },
  buttonStyle: {
    marginTop: 30,
    borderStyle: 'solid',
  },
  votePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#efefef',
    margin: 10,
    padding: 20,
    borderRadius: 5
  }
});