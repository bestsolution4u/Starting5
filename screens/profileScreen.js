/**
 * Displays the users profile as well as some settings.
 */
import React, { createRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Button,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';

import { Icon } from 'react-native-elements';
import { LineChart } from "react-native-chart-kit";

import ProgressCircle from "../controllers/ProgressCircle";
import MyHeader from "./headerFragment";
import { LoadingModal, HLine, getColour, getStats, getMonthsSinceSignup } from "../controllers/helperFunctions";
import { getUserData, getMoods } from "../controllers/localDB";

//Styles
import appStyle from '../styles/appStyle';
import profileStyle from "../styles/profileStyle";

//import capture and download components
import ViewShot, { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Share from 'react-native-share';

//Assets
const profileIcon = require("../assets/icons/profile-icon.png");

//Dummy data
const user = { user_id: 0, first_name: "Tommy", last_name: "" };


/**
 * Displays some stat about the progress of the program, or
 * average activity completion.
 * TBA
 * 
 * Requires: "progress" prop with a value from 0 to 1.
 */
const ProgressIcon = (props) => {

  //Make sure to check that data is valid before rendering it - lifecycle errors and such
  return (
    <View style={profileStyle.progressCircle} >
      <ProgressCircle
        value={props.progress}
        size={60}
        thickness={4}
        color={appStyle.pinkColour.backgroundColor}
        animationMethod="timing"
        animationConfig={{ speed: 1 }}
      />
      <Text style={[appStyle.H3, appStyle.purpleFontColour, { fontSize: 18, fontWeight: "bold", top: 16, position: "absolute" }]}>{(props.progress * 100).toFixed(0)}%</Text>

    </View>
  )
}

/**
 * Just a circle icon, similar to progress icon but with no graph
 * Required Props:
 * Text: string
 */
const CircleIcon = (props) => {
  return (
    <View style={profileStyle.progressCircle} >
      <Text style={[appStyle.H3, appStyle.purpleFontColour, { fontWeight: "bold" }]}>{props.text}</Text>
    </View>
  )
}

/**
 * component which plots the mood graph in a box
 * @param {*} props 
 */
const MoodGraph = (props) => {


  return (
    <LineChart
      data={{
        datasets: [
          {
            data: props.data
          }
        ]
      }}
      width={Dimensions.get("window").width} // from react-native
      height={150}
      yAxisInterval={0.25} // optional, defaults to 1
      heading={props.heading}
      withVerticalLines={false}
      withHorizontalLines={false}
      withVerticalLabels={false}
      formatYLabel={(label) => ""}
      chartConfig={{
        backgroundColor: "#000000",
        backgroundGradientFrom: "#000000",
        backgroundGradientTo: "#080808",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => props.colour,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "4",
          strokeWidth: "2",
          stroke: "#FAFAFA"
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
}
/**
 * Entry point for the Profile Screen
 */
export class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      longestStreak: 0,
      points: 0,
      months: 0,
      level: "",
      progress: 0,
      userData: null, //User's details
      monthsSinceSignup: null, //Months since the user first created their account
      moods: null, //Array of moods
      imageUri: '', // For testing image
    };
    // create a reference for each of the mood graphs to be shared
    this.moodRef = createRef()
    this.energyRef = createRef()
    this.motivationRef = createRef()
  }

  //Load database data
  componentDidMount() {

    //Get local data and stats
    this.loadData();

    //Add a listener to make sure that data re-loads if the focus changes
    this.focusListener = this.props.navigation.addListener('focus', () => {
      //Update stats when focus changes, the user might have done an activity
      this.loadData();
    });

    this.getPermissionAndroid();

  }


  //Remove any listeners
  componentWillUnmount() {
    this.focusListener();
  }

  //Loads local database data and calculates stats (streak, points, etc)
  loadData() {
    //Get the user data
    getUserData().then(result => {
      console.log("user data:", result);
      this.setState({ userData: result });
    });

    //Get the stats
    getStats().then(result => {
      console.log("stats:", result);
      this.setState({
        longestStreak: result.streak,
        points: result.points,
        months: result.months,
        level: result.level,
        progress: result.progress,
      });
    });

    //Get the moods
    getMoods().then((result) => {
      //Only load the moods graph if there are at least 3 data points to display
      if (result) {
        console.log("moods:", result);
        let moodList = result;
        if (moodList.length > 2) {
          //Turn the moods in to flat arrays
          let moods = { energy: [], mood: [], motivation: [] };
          for (let i = 0; i < moodList.length; i++) {
            moods.energy.push(moodList[i].energy);
            moods.mood.push(moodList[i].mood);
            moods.motivation.push(moodList[i].motivation);
          }

          this.setState({ moods })
        }
      }
    }).catch((err) => this.setState({ moods: null }));

    //Get the months since signup
    getMonthsSinceSignup().then((memberSince) => {
      this.setState({ memberSince });
      console.log("Months since member started:", memberSince);
    });
  }


  // get permission on android
  getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        '',
        'Your permission is required to save images to your device',
        [{ text: 'OK', onPress: () => { } }],
        { cancelable: false },
      );
    } catch (err) {
      // handle error as you please
      console.log('err', err);
    }
  };

  // share image
  shareImage = async (number) => {

    try {
      // react-native-view-shot caputures component
      let uri = null
      if (number == 1) {
        uri = await captureRef(this.moodRef, {
          format: 'png',
          quality: 0.8,
        });
      } else if (number == 2) {
        uri = await captureRef(this.energyRef, {
          format: 'png',
          quality: 0.8,
        });
      } else if (number == 3) {
        uri = await captureRef(this.motivationRef, {
          format: 'png',
          quality: 0.8,
        });
      }


      console.log('uri ====> ', uri)
      if (Platform.OS === 'android') {
        const granted = await this.getPermissionAndroid();
        if (!granted) {
          return;
        }
      }
      // share
      const shareResponse = await Share.open({ url: uri });
    } catch (error) {
      console.log('error', error);
    }
  };

  shareText = async () => {

    try {

      if (Platform.OS === 'android') {
        const granted = await this.getPermissionAndroid();
        if (!granted) {
          return;
        }
      }
      // share
      const message = "Hey, I have been using this great app called Starting Five.\nhttps://www.startingfive.com.au"
      const shareResponse = await Share.open({ message: message });
    } catch (error) {
      console.log('error', error);
    }
  };



  render() {
    return (
      <View style={appStyle.mainBox}>
        <MyHeader />

        {/* A loading box for when developer controls are used */}
        <LoadingModal isLoading={this.state.isLoading} />

        <ScrollView style={{ width: "100%", backgroundColor: "black" }}>

          {/* White top box and profile image */}
          <View style={profileStyle.whiteHeader} >
            <View style={profileStyle.profilePicBox}>
              <Image source={profileIcon} style={profileStyle.profileImage} />
            </View>
          </View>

          {/* Main body box */}
          <View style={profileStyle.largeBlackBox}>

            {/* User's details */}
            <View style={{ marginBottom: 20 }}>

              {this.state.userData ?
                <Text style={[appStyle.H1, { color: "white", textAlign: "center" }]}>{this.state.userData.user_credential.user_first_name}</Text>
                :
                <View style={{ height: 50 }} />
              }

              <Text style={[appStyle.H4, { color: "white" }]}>Member since {this.state.memberSince ? this.state.memberSince.memberSince : null}</Text>
            </View>

            <HLine />

            {/* Stats box showing points, streak, etc */}
            {/* First row */}
            <View style={profileStyle.statsBox} >
              <View style={profileStyle.statItemBox}>
                <Text style={[appStyle.H4, { color: "white" }]}>MONTH</Text>
                <CircleIcon text={this.state.memberSince ? this.state.memberSince.numberOfMonths : null} />
              </View>
              <View style={profileStyle.statItemBox}>
                <Text style={[appStyle.H4, { color: "white" }]}>PROGRESS</Text>
                <ProgressIcon progress={this.state.progress} />
              </View>
              <View style={profileStyle.statItemBox}>
                <Text style={[appStyle.H4, { color: "white" }]}>DAILY STREAK</Text>
                <CircleIcon text={this.state.longestStreak} />
              </View>
            </View>

            <HLine />

            {/* Second row */}
            <View style={profileStyle.statsBox} >
              <View style={profileStyle.statItemBox}>
                <Text style={[appStyle.H2, appStyle.blueFontColour, { fontWeight: "bold" }]}>{this.state.points}</Text>
                <Text style={[appStyle.H4, { color: "white", textAlign: "center" }]}>POINTS</Text>
              </View>

              <View style={profileStyle.statItemBox}>
                <Text style={[appStyle.H3, appStyle.pinkFontColour, { textAlign: "center", fontFamily: "MonumentExtended-Regular" }]}>{this.state.level}</Text>
                <Text style={[appStyle.H4, { color: "white", textAlign: "center" }]}>LEVEL</Text>
              </View>

              <View style={profileStyle.statItemBox}>
                <Text style={[appStyle.H2, { fontWeight: "bold", color: "white" }]}>{400 - this.state.points}</Text>
                <Text style={[appStyle.H4, { color: "white", textAlign: "center" }]}>TO NEXT LEVEL</Text>
              </View>
            </View>

            <HLine />

            {/* The mood graph/s */}
            {this.state.moods ?
              <View style={{ flexDirection: 'column' }}>

                {/* {Set the component which want to save image with Ref} */}

                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity style={profileStyle.saveButton} onPress={() => this.shareImage(1)}>
                    <Text style = {{alignSelf: 'center'}}>Share</Text>
                  </TouchableOpacity>
                  <View collapsable={false} ref={this.moodRef}>
                    <View style={{ alignItems: "center", backgroundColor: "#000000" }}>
                      <Text style={[appStyle.H4,
                      {
                        color: "white", fontWeight: "bold",
                        textAlign: "center"
                      }]}>MOOD</Text>
                      <MoodGraph data={this.state.moods.mood} colour={getColour("blue")} />
                      <Text style={[appStyle.H4, { color: "white", textAlign: "center", top: -20 }]}>30 DAYS</Text>
                      <HLine />
                    </View>
                  </View>

                  <TouchableOpacity style={profileStyle.saveButton} onPress={() => this.shareImage(2)}>
                    <Text style = {{alignSelf: 'center'}}>Share</Text>
                  </TouchableOpacity>
                  <View collapsable={false} ref={this.energyRef}>
                    <View style={{ alignItems: "center", backgroundColor: "#000000" }}>
                      <Text style={[appStyle.H4,
                      {
                        color: "white", fontWeight: "bold",
                        textAlign: "center"
                      }]}>ENERGY</Text>
                      <MoodGraph data={this.state.moods.energy} colour={getColour("purple")} />
                      <Text style={[appStyle.H4, { color: "white", textAlign: "center", top: -20 }]}>30 DAYS</Text>
                      <HLine />
                    </View>
                  </View>

                  <TouchableOpacity style={profileStyle.saveButton} onPress={() => this.shareImage(3)}>
                    <Text style = {{alignSelf: 'center'}}>Share</Text>
                  </TouchableOpacity>
                  <View collapsable={false} ref={this.motivationRef}>
                    <View style={{ alignItems: "center", backgroundColor: "#000000" }}>
                      <Text style={[appStyle.H4,
                      {
                        color: "white", fontWeight: "bold",
                        textAlign: "center"
                      }]}>MOTIVATION</Text>
                      <MoodGraph data={this.state.moods.motivation} colour={getColour("green")} />
                      <Text style={[appStyle.H4, { color: "white", textAlign: "center", top: -20 }]}>30 DAYS</Text>
                    </View>
                  </View>
                </View>


              </View>
              :
              null
            }

            <HLine />

            {/* User Level details */}
            <View style={{ marginTop: 20, marginBottom: 20, width: "100%" }}>

              {this.state.userData ?
                <Text style={[appStyle.H3, { color: "white", textAlign: "center", fontFamily: "NotoSansKR-Regular" }]}>
                  Keep up the good work, {this.state.userData.user_credential.user_first_name}!
                </Text>
                :
                <View style={{ height: 30 }} />
              }

              <View style={{ marginTop: 20, marginBottom: 20 }}>
                <Icon name={"ravelry"}
                  type="font-awesome"
                  size={100}
                  color={"white"}
                />
              </View>

              <TouchableOpacity style={[appStyle.defaultButton, { width: "90%", alignSelf: "center" }]} onPress={this.shareText}>
                <Text style={appStyle.buttonText}>SHARE S5 WITH A MATE</Text>
              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>

      </View>
    )
  }
}