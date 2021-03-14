/**
 * Header classes to be displayed on each page.
 * The header is composed of a Left, Center, and Right Component class.
 */
import React, {Fragment, useEffect} from 'react';
import { View, SafeAreaView, StatusBar, Text, Image, Pressable, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { Header, Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


//Stylesheets
import appStyle from "../styles/appStyle";
import headerStyle from "../styles/headerStyle";

//Assets
const starting5 = require("../assets/starting-5.png");
const s5Icon = require("../assets/s5-black/s5-black.png");
const profileIcon = require("../assets/profile-icon-example.png");
const s5Image = require("../assets/title-image.png");

/**
 * The center component of the header just displays the 
 * "Starting 5" image
 */
function HeaderCenter () {
  return(
    <Image source={s5Image} style={headerStyle.centreImage} />
  )
}

/**
 * The left component displays an icon which can be clicked.
 */
function HeaderLeft() {
  const navigation = useNavigation();

  return(
      <Icon
        name="navicon"
        type="font-awesome"
        onPress={() => {navigation.toggleDrawer()}}
      />
  )
}

/**
 * The right most component of the header displays
 * the profile picture and can be clicked.
 */
function HeaderRight () {
  const navigation = useNavigation();

  return(
    null
  )
}

/**
 * Constructs a react-native-elements header and displays the
 * individual components above.
 */
export default class MyHeader extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
        return (
          <Header
            backgroundColor={"#FFFFFF"}
            leftContainerStyle={{flex: 1}}
            leftComponent={<HeaderLeft />}
            centerContainerStyle={{flex: 6}}
            centerComponent={<HeaderCenter />}
            rightContainerStyle={{flex: 1}}
            rightComponent={<HeaderRight />}
          />
        )
    }
}