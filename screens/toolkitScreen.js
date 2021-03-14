/**
 * Starting5 Skills screen shows some individual skills for the user.
 */
import React, {Fragment, useEffect} from 'react';
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import MyHeader from "./headerFragment";
import { ActivityFragment, ActivityModal } from "./activityFragment";

import { getToolkitActivities, getDaysSinceProgramStart, saveToolkitActivities } from "../controllers/localDB";
import { getRemoteToolkitActivities } from "../controllers/remoteDB";
import {  } from "../controllers/helperFunctions";

//Styles
import appStyle from '../styles/appStyle';
import toolkitStyle from "../styles/toolkitStyle";

//Assets
const stretchImage = require("../assets/images/woman-stretching-on-ground.jpg");
const manImage = require("../assets/images/man-wearing-black-shirt-and-jeans.jpg");
const circleIcon = require("../assets/s5-coloured-circle.png");
const headingMessage = "Every day is a chance to learn something new and we are introducing S5 Skills to do just this.\nYou will learn off industry professionals all the tips and tricks you have been too afraid to ask how to do."


const whiteCircleIcon = require("../assets/circle-icon.png");
const flagIcon = require("../assets/icons/flag-icon-filled.png");
const tickIcon = require("../assets/tick-icon.png");

/**
 * Displays a list of skills for the user to use
 */
export class ToolkitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedActivities: null, //The collection of saved activities
      daysToShow: null, //Number of items to display
      showModal: false, //Show a modal to confirm starting an activity
      activityModal: null, //The activity modal response (start, or close)
      activityRef: null, //Reference to the activity modal for which activity to open
    };
  }

  //Load things
  componentDidMount() {
    this.loadData();
    
    //Add a listener to make sure that data re-loads if the focus changes
    this.focusListener = this.props.navigation.addListener('focus', () => {
      //Update with data from the local DB
      this.loadData();
    });
  }

  
  //Remove any listeners
  componentWillUnmount() {
    this.focusListener();
  }

  //Loads database data and updates state
  loadData() {
    //Get the saved activities
    getToolkitActivities().then((result) => {
      let savedData = [];
      if(result != null) {
        savedData = result;
      }

      //Dummy mechanism that adds one toolkit item every 6 days
      getDaysSinceProgramStart().then((day) => {
        const numItems = Math.floor(day / 6);

        this.setState({savedActivities: savedData, daysToShow: numItems});
        console.log("number of Toolkit items:", savedData.length);
      });

    });

  }

  
  /**
   * The saved activity unit which is really just an ActivityFragment
   * with some extra flair.
   * 
   * Required props:
   * activity
   * 
   * @param {*} props 
   */
  savedActivity(activity, index) {
    //If the activity should be shown in a disabled state then modify the "complete" tag
    let thisActivity = activity;
    if(index > this.state.daysToShow) {
      thisActivity.disabled = true;
      thisActivity.complete = true;
    }

    return(
      <View style={toolkitStyle.activityItem}
          key={index} >
        <ActivityFragment 
          activityDetails={[thisActivity]}
          activityModal={(show, activityModal, activityRef) => this.setState({showModal: show, activityModal, activityRef})}
          slotIndex={index}
          toolkitItem={true}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={appStyle.mainBox}>

        <MyHeader />
          
        <ScrollView style={{width: "100%"}}>
          <View style={{flex: 1, width: "100%"}}>

            <View style={appStyle.headingBox}>
              <Text style={[appStyle.headerText]}>TOOL KIT</Text>
            </View>

            <View style={[appStyle.bodyBox, {marginTop: 10, marginLeft: -20}]}>
            {/* check if data is valid, then render saved activities */}
            {
              this.state.savedActivities ?
                this.state.savedActivities.map((activity, index) => 
                  this.savedActivity(activity, index)
                )
              :
                null
            }

            { //If an activity has been selected then show the summary modal with data. Can't instantiate this without data.
              this.state.showModal ?
              <ActivityModal activityModal={this.state.activityModal} 
                  showModal={this.state.showModal} hideModal={(hide) => this.setState({showModal: !hide}) }
                  navigation={this.props.navigation} 
                  today={null}
                  activityRef={this.state.activityRef}
                  displayOnly={true}
              />
              :
              null
            }
            
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}