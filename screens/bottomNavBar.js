/**
 * Provides a navigation bar for the bottom of the screen.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
//Styles
import appStyle from "../styles/appStyle";
import navStyle from "../styles/navigationStyle";
import homeStyle from "../styles/homeStyle";

//Assets
const s5Icon = require("../assets/s5-black-bordered-icon.png");
const profileIcon = require("../assets/icons/profile-icon.png");
const profileIconFilled = require("../assets/icons/profile-icon-filled.png");
const calendarIcon = require("../assets/icons/calendar-icon.png");
const calendarIconFilled = require("../assets/icons/calendar-icon-filled.png");
const toolkitIcon = require("../assets/icons/star-icon.png");
const toolkitIconFilled = require("../assets/icons/star-icon-filled.png");
const flagIcon = require("../assets/icons/flag-icon.png");
const flagIconFilled = require("../assets/icons/flag-icon-filled.png");
const homeIcon = require("../assets/icons/home-icon.png");
const homeIconFilled = require("../assets/icons/home-icon-filled.png");


/**
 * 
 */
export class BottomNavBar extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
    }
  

  render() {
    return (
      <SafeAreaView>
        <View style={[navStyle.mainBox, appStyle.greyColour]}>
          {this.props.state.routes.map((route, index) => {
            const { options } = this.props.descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;
    
            //Is this item the current view to highlight
            const isFocused = this.props.state.index === index;
    
            const onPress = () => {
              const event = this.props.navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
    
              if (!isFocused && !event.defaultPrevented) {
                this.props.navigation.navigate(route.name);
              }
            };
    
            const onLongPress = () => {
              this.props.navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            //Select the appropriate image to show
            let thisImage = s5Icon;
            if(label == "Home") { isFocused ? thisImage = homeIconFilled : thisImage=homeIcon };
            if(label == "Progress") { isFocused ? thisImage = calendarIconFilled : thisImage = calendarIcon };
            if(label == "Profile") { isFocused ? thisImage = profileIconFilled : thisImage = profileIcon };
            if(label == "Toolkit") { isFocused ? thisImage = toolkitIconFilled : thisImage = toolkitIcon };
            if(label == "Saves") { isFocused ? thisImage = flagIconFilled : thisImage = flagIcon };

    
            return (
              <TouchableOpacity 
                key={route.key}
                accessibilityRole="button"
                accessibilityStates={isFocused ? ['selected'] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[navStyle.buttonBox, {
                  backgroundColor: appStyle.greyColour.backgroundColour, 
                  borderRadius: 8}]}
              >
                <Image source={thisImage} style={[navStyle.iconImage, 
                  ]} />
              </TouchableOpacity>
            );
          })}
        </View>
        </SafeAreaView>
      )
    };
}