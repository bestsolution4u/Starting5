/**
 * A class to demonstrate the music player
 */
import React, {Fragment, useEffect, useState} from 'react';
import { View, Text, Button, Image, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

import Player from "../controllers/Player";

import appStyle from '../styles/appStyle';

/**
 * Plays the requested track. Accepts props:
 * media_src - the URI to play
 * activity - the activity data
 * taskNumber - this task number
 * paused - the pause state of the media
 * 
 * @param {*} props 
 */
export default function MusicPlayer(props) {
  const playbackState = usePlaybackState();

  
  useEffect(() => {
    if(playbackState == TrackPlayer.STATE_NONE ) {
      setup();
    }

    //Destroy the track player if the activity closes
    return () => {
      //Component will unmount
      TrackPlayer.reset();
      TrackPlayer.destroy();
      }
  }, []);

  //Create a track object
  const thisTrack = {id: props.taskNumber,
                    url: props.media_src,
                    title: props.activity.activity_title,
                    artist: props.activity.author_name,
                    artwork: props.authorImage
  }

  async function setup() {
    await TrackPlayer.setupPlayer({});
    TrackPlayer.registerPlaybackService(()=> require("../controllers/musicPlayerService.js"));
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ]
    });
    //Add the correct track to play
    await TrackPlayer.add(thisTrack);

    //Set the play/pause state to the app play/pause state
    props.paused ? TrackPlayer.pause() : TrackPlayer.play();
  }

  async function togglePlayback() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      await TrackPlayer.reset();
      //Add the correct track to play
      await TrackPlayer.add(thisTrack);
      await TrackPlayer.play();
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  }

  return (
    <View style={styles.container}>
      <Player
        onNext={skipToNext}
        style={styles.player}
        onPrevious={skipToPrevious}
        onTogglePlayback={togglePlayback}
      />
    </View>
  );
}

MusicPlayer.navigationOptions = {
  title: "Playlist Example"
};

function getStateName(state) {
  switch (state) {
    case TrackPlayer.STATE_NONE:
      return "None";
    case TrackPlayer.STATE_PLAYING:
      return "Playing";
    case TrackPlayer.STATE_PAUSED:
      return "Paused";
    case TrackPlayer.STATE_STOPPED:
      return "Stopped";
    case TrackPlayer.STATE_BUFFERING:
      return "Buffering";
  }
}

async function skipToNext() {
  try {
    await TrackPlayer.skipToNext();
  } catch (_) {}
}

async function skipToPrevious() {
  try {
    await TrackPlayer.skipToPrevious();
  } catch (_) {}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  description: {
    width: "80%",
    marginTop: 0,
    textAlign: "center"
  },
  player: {
    marginTop: 40
  },
  state: {
    marginTop: 20
  }
});