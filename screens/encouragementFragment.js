/**
 * Displays the encouragement message at the top of the home screen.
 */
import React, {Fragment, useEffect} from 'react';
import { View, Text, Button, Image, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import appStyle from '../styles/appStyle';
import encouragementStyle from '../styles/encouragementStyle';

export class EncouragementBox extends React.Component {
  constructor(message, props) {
    super(message, props);
    this.state = {
    };
  }

  

  render() {
    return (
      <View style={encouragementStyle.mainBox}>
        <Text style={encouragementStyle.sidewaysText}>Reminder</Text>
        <View style={encouragementStyle.regularText}>
          <Text style={encouragementStyle.H2}>
            {this.props.message}
          </Text> 
        </View>
        
      </View>
    )
  }
}