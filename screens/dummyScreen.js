/**
 * This is just a class that displays some text on a blank screen for testing purposes.
 */
import React, {Fragment, useEffect} from 'react';
import { View, Text, Button, Image, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import appStyle from '../styles/appStyle';


/**
 * Just displays some text on a blank screen
 */
export class DummyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  

  render() {
    return (
      <View style={appStyle.fullBox}>
        <Text style={{fontSize: 32}}>This page intentionally left blank.</Text>
      </View>
    )
  }
}