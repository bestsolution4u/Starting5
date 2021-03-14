/**
 * Displays the user's progress through the program with a graph of activities
 * completed this week, as well as goals reached.
 */
import React, {useRef, useEffect} from 'react';
import { View, Text, ScrollView, SafeAreaView, Animated, Image, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, Platform } from 'react-native';

import { Card , Button, Overlay, Icon } from 'react-native-elements';


import MyHeader from "./headerFragment";

import ProgressCircle from "../controllers/ProgressCircle";
import { getAllActivities, getDaysSinceProgramStart, getUserData, programDayToDate } from "../controllers/localDB";
import { smallScreenWidth, numActivitiesCompleted, getColour, getRestDays } from "../controllers/helperFunctions";
import { quotes } from "../controllers/dummyData";

//Stylesheets
import appStyle from '../styles/appStyle';
import progressStyle from "../styles/progressStyle";

//assets
const s5 = require("../assets/icons/s5-coloured.png");

/**
 * This displays the motivational quote which will show whenever the progress page is loaded.
 * No props are required.
 * required props:
 * 
 * showModal - bool
 * clearModal - callback to clear the modal
 * quote - {text, author}
 * @param {*} props 
 */
export const MotivationalQuoteModal = (props) => {

  const width = Dimensions.get("window").width;

  return (
    <Overlay isVisible={props.showModal}
      overlayStyle={progressStyle.quoteModalBox}
      >
    <SafeAreaView style={{flex: 1}}>
      
      <ScrollView>
        <View style={{height: "100%"}}>
          <View style={{flex: 1, paddingTop: 30, alignItems: "center", width: "100%",}}>
            <Image source={s5} style={{width: 150, height: 150, resizeMode: "contain"}} />
          </View>

          <View style={{flex: 2, marginBottom: 60}}>
            <Text style={[appStyle.H3, {color: "white", marginBottom: 20, marginTop: 40, textAlign: "center"}]}>STEP BY STEP</Text>
            <Text style={[appStyle.H1, {color: "white", textAlign: "center"}]}>{props.quote.text}</Text>
            <Text style={[appStyle.H3, {color: "white", textAlign: "center"}]}>{' - '}{props.quote.author}</Text>
          </View>

          
        </View>
      </ScrollView>

      {/* Complete / Done button */}
      <View style={{flex: 1, justifyContent: "flex-end", 
        alignSelf: "flex-end", width: "100%"}}>
        <TouchableOpacity
          onPress={() => props.clearModal(true)}
          style={{alignItems: "center", marginBottom: 10, zIndex: 999}}
        >
          <View style={[appStyle.circleIcon, {borderColor: getColour("green")}]}>
            <Icon name={"check"} 
              type="font-awesome" 
              size={20}
              color={appStyle.greenColour.backgroundColor}
            />
          </View>
          <Text style={[appStyle.secondaryButtonText]}>NEXT</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
    </Overlay>
  );
}

/**
 * Provides a circle icon for that day with the
 * day number in the center, and either a white border,
 * or a progress graph representing the number of activities
 * completed that day.
 * 
 * Requires a DAY object prop
 * A unique KEY
 * restDays (an array of rest days)
 * thisDay (day being rendered for the calendar)
 * programDay (current program day)
 * width (screen width)
 */
const DayIcon = (props) => {
  //Calculate the percentage of activities completed
  var percentActivitiesCompleted = (numActivitiesCompleted(props.day) / 5);
  //Check if today is a rest day
  var isRestDay = false;
  if(props.restDays) {
    for(let i = 0; i < props.restDays.length; i++) {
      if((props.day[0][0].day_of_program % 7) == props.restDays[i]) {
        isRestDay = true;
      }
    }
  }

  //Check if today is the current program day
  let isToday = false;
  if(props.programDay == (props.thisDay + 1)) {
    isToday = true;
  }

  //Calculate the day of the program
  let todayDate = new Date().getTime();
  todayDate = todayDate - ((props.programDay - (props.thisDay + 1)) * 24 * 3600 * 1000);
  
  
  const width = Dimensions.get("window").width;

  //Make sure to check that data is valid before rendering it - lifecycle errors and such
  return(
      props.day ? 
        <View style={[progressStyle.dayCircle, 
        {width: props.width, height: props.width, borderRadius: props.width / 2},
        isRestDay ? {borderColor: "gray"} : null,
        ]} >
          <ProgressCircle
            value={percentActivitiesCompleted}
            size={props.width}
            thickness={4}
            color={appStyle.pinkColour.backgroundColor}
            animationMethod="timing"
            animationConfig={{speed: 1}}
          />
          <Text style={[appStyle.H3, {color: "white", top: 8, position: "absolute"},
            isRestDay ? {color: "gray"} : null,
            width < smallScreenWidth ? {fontSize: 16, top: -0} : null,
          ]}>
            {props.day.length > 1 ? props.day[0][0].day_of_program : null}
          </Text>
          {/* We need to place a star in the corner of days with toolkit items - dummy algorithm for now */}
          {props.day.length > 1 ?
            props.day[0][0].day_of_program % 6 == 0 ?
              <View style={{position: "absolute", left: props.width - 7, top: -4}}>
                <Icon name={"star"} 
                  type="font-awesome" 
                  size={14}
                  color={"white"}
                />
              </View>
              :
                null
            :
            null
          }
      
          <Text style={[appStyle.H5, {color: "white", top: props.width - 2, position: "absolute"},
            width < smallScreenWidth ? {fontSize: 8} : null,
            isToday ? {fontWeight: "bold"} : null
            ]}>
          {new Date(todayDate).toString().substring(4, 10)}</Text>
        </View>
      :
        null
  )
}

/**
 * Main container to show program progress, as well as the daily checklist
 */
export class ProgressScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(), //Today's Date
      month: null, //The full month object
      userdata: null, //user credentials
      showModal: true, //The motivational quote modal
      randomQuote: quotes[Math.floor((Math.random() * quotes.length))], //A random quote to display
      restDays:  null, //Rest days for the program, if any
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      OS: Platform.OS, //OS
      programDay: 1,
    };
    Dimensions.addEventListener("change", (e) => {
      this.setState(e.window);
  });
  }

  //Logic to retreive the daily data from the data store and udpate the state
  loadLocalData() {
    //Get some activities to display
    getAllActivities().then(result => {
      //Check if there actually is data for today and update the state, otherwise do nothing
      if(result) {
        this.setState({month: result});
      }
    });

    //Get the user data
    getUserData().then(result => {
      console.log("user data:", result);
      this.setState({userData: result});
    });

    //Get the current program day
    getDaysSinceProgramStart().then((programDay) => this.setState({programDay}));
  }

  //Load local data from the database
  componentDidMount() {
    getRestDays().then((days) => {
      if(days) {
        this.setState({restDays: days});
      }
  });

    //Show the motivational quote AGAIN
    this.setState({showModal: true});

    console.log("screen width:", this.state.width);

    this.loadLocalData();

    //Add a listener to make sure that data re-loads if the focus changes
    this.focusListener = this.props.navigation.addListener('focus', () => {

      //Update with data from the local DB
      this.loadLocalData();
    });
  }


  //Remove any listeners
  componentWillUnmount() {
    this.focusListener();
  }

  render() {
    //Calculate the width of each circle element - either a portion of the screen, or 40px, whichever is smaller
    let  dayBoxWidth = (this.state.width  / 7) - 10;
    if(dayBoxWidth > 40) {
      dayBoxWidth = 40;
    }
    
    return (
      <View style={appStyle.mainBox}>

        <MyHeader />
          <ScrollView style={{backgroundColor: "black", width: "100%"}}>

            {/* Header */}
            <View style={[appStyle.headingBox]}>
              <Text style={[appStyle.headerText]}>PLANNER</Text>
            </View>
              
            <View style={appStyle.bodyBox}>

              {/* Title */}
                <View style={progressStyle.titleBox}>
                  <Text style={[appStyle.H1, {color: "white"}]}>{this.state.currentDate.toDateString().substring(4, this.state.currentDate.length)}</Text>
                </View>

              <Text style={[appStyle.H3, {color: "white"}]}>Great job, {this.state.userData ? this.state.userData.user_credential.user_first_name : null}!</Text>
              {/* days of week */}
              <View style={{flexDirection: 'row'}}>
                {
                  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((item) => <View style={{width: 40, alignItems: 'center'}}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{item}</Text>
                  </View>)
                }
              </View>

              {/* The calendar items, or a placeholder graphic while loading */}
              <View style={[progressStyle.calendarBox]}>
              {
                this.state.month ? this.state.month.length > 1 ?
                  this.state.month.map((day, index) => 
                  <DayIcon key={index} 
                    day={day} 
                    width={dayBoxWidth} 
                    restDays={this.state.restDays} 
                    thisDay={index} 
                    programDay={this.state.programDay} />) 
                    : null
                :
                  [...Array(28)].map((item, index) => <View key={index} 
                    style={[progressStyle.dayCircle, {borderColor: "gray", width: dayBoxWidth, height: dayBoxWidth, borderRadius: dayBoxWidth / 2}]} />)
              }
              </View>

              
              <View style={progressStyle.bottomBox}>
                  <Text style={appStyle.H3, {color: "white", textAlign: "center", width: "90%"}}>
                  {' '}
                  <Icon name={"star"} 
                      type="font-awesome" 
                      size={14}
                      color={"white"}
                      containerStyle={{width: 14, height: 14}}
                    />
                    <Text>Unlock exclusive life hacks, tools, and resources as you progress.</Text>
                  </Text>
              </View>

              <MotivationalQuoteModal clearModal={(clear) => this.setState({showModal: false})} showModal={this.state.showModal} quote={this.state.randomQuote} />

              
            </View>
          </ScrollView>
      </View>
    )
  }
}