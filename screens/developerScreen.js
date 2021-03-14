/**
 * A special developer pannel with developer only options
 */
import React, {Fragment, useEffect, useRef} from 'react';
import { View, Text, ScrollView, Animated, Button, Image, TextInput, Modal, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';


import ProgressCircle from "../controllers/ProgressCircle";
import MyHeader from "./headerFragment";
import { LoadingModal, HLine, ErrorModal } from "../controllers/helperFunctions";
import { clearAllAppData, getAllAppData, saveProgram, 
  getUserData, saveMood } from "../controllers/localDB";
import { createUser, getRemoteProgram, getActivityByID, setSurveyResponse } from "../controllers/remoteDB";
import { ActivityModal } from "../screens/activityFragment";
import { MoodSelector } from "../screens/moodSelector";

//Styles
import appStyle from '../styles/appStyle';
import developerStyle from "../styles/developerStyle";


/**
 * A modal which asks for the user to enter an activity ID to display
 * 
 * @param {*} props 
 */
const ActivitySelectModal = (props) => {
  let activity_id = 0;
  return(
    <Modal
      transparent={true}
      animationType={'none'}
      visible={props.showModal}>
      <View style={appStyle.modalBackground}>
        <View style={appStyle.errorModalBox}>
          <Text style={appStyle.H3}>Activity ID to display</Text>

          <TextInput style={appStyle.textInput} 
            numberOfLines={1} 
            placeholder={"activity_id"}
            editable={true}
            onChangeText={(value) => activity_id = value}
          />

          <TouchableOpacity style={[appStyle.secondaryButton, {width: "90%"}]}
            onPress={() => props.getActivity(activity_id)}>
            <Text style={appStyle.secondaryButtonText}>OK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]}
            onPress={() => props.dismissModal()}>
            <Text style={appStyle.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


/**
 * Entry point of the contact us screen. Where users can contact the
 * app owners.
 */
export class DeveloperScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false, //Flag to show / hide the loading circle
      error: null, //An error to display
      showActivityModal: false, //Show the activity modal
      activtyModal: null, //The activity data to show
      activitySelectModal: null, //Show / hide the activity seleciton modal
      showMoodModal: false, //Show / hide the mood selector
    };
  }

  /**
   * Hides the error modal box
   */
  hideError() {
    this.setState({error: null});
  }

  //Clears ALL APP DATA. Removes every async storage key related to this app
  clearData() {
    clearAllData().then(
      getAllKeys().then(result => console.log("after clear: ", result))
    );
  }

  /**
   * Creates a new user
   */
  create() {
    this.setState({isLoading: true});

    createUser().then((result) => {
      console.log("create user:", result);
      this.setState({isLoading: false});
    }).catch((error) => this.setState({isLoading: false}));
  }

  /**
   * Gets todays program for this yser
   */
  program() {
    this.setState({isLoading: true});

    getUserData().then((userData) => {
        getRemoteProgram(userData).then((newProgram) => {
          console.log("get program:", newProgram);
          if(newProgram.program) {

            //Save program
            saveProgram(newProgram).then(() => this.setState({isLoading: false}));
          } else {
            this.setState({isLoading: false, error: "The server returned an empty or broken program."});
          }
        }).catch((error) => this.setState({isLoading: false, error: "There was a network error while fetching the program."}));
      });
  }
  /**
   * Submits a fake survey response and logs the returned program to console.
   */
  survey() {
    this.setState({isLoading: true});

    getUserData().then((userData) => {
        setSurveyResponse(userData).then((newProgram) => {
          console.log("Program Returned:", newProgram);
          if(newProgram.program) {
          } else {
            this.setState({isLoading: false, error: "The server returned an empty or broken program."});
          }
        }).catch((error) => this.setState({isLoading: false, error: "There was a network error while fetching the program."}));
      });
  }

  /**
   * Requests a specific activity from the server and displays it.
   */
  getActivity(activity_id) {
    this.setState({isLoading: true});

    getActivityByID(activity_id).then((activity) => {
      console.log("activity ID:", activity_id, "Activity Provided:", activity);
      //If a valid activity was returned, then display it
      if(activity) {
        this.setState({isLoading: false, activitySelectModal: false, showActivityModal: true, activityModal: activity});
      } else {
        this.setState({isLoading: false, error: "Activity not found."});
      }
    }).catch((err) => this.setState({isLoading: false, error: "Network or server error."}));
  }

  /**
   * Logs all app data to the console
   */
  allAppData() {
    getAllAppData().then((data) => console.log("All app data:", data));
  }


  newMood(sliderValues) {
    console.log("save sliders:", sliderValues);

    saveMood(sliderValues);

    //Clear the modal
    this.setState({showMoodModal: false});
  }

  render() {
    return (
      <View style={appStyle.mainBox}>

        <MyHeader />
          <ScrollView style={{width: "100%"}}>
            <View style={{flex: 1, width: "100%"}}>

              <LoadingModal isLoading={this.state.isLoading} />

              <ErrorModal showError={this.state.error ? true : false} error={this.state.error} dismissError={() => this.hideError()} />

              { //If an activity has been selected then show the summary modal with data. Can't instantiate this without data.
              this.state.showActivityModal ?
                <ActivityModal activityModal={this.state.activityModal} 
                    showModal={this.state.showActivityModal} hideModal={(hide) => this.setState({showActivityModal: !hide}) }
                    navigation={this.props.navigation} 
                    today={null}
                    activityRef={null}
                    displayOnly={true}
                />
                :
                null
              }

              <MoodSelector showModal={this.state.showMoodModal}
                  hideModal={(hide) => this.setState({showMoodModal: !hide})}
                  saveMood={(sliderValues) => this.newMood(sliderValues)}
                  name={"Code Monkey"}
              />

              <ActivitySelectModal showModal={this.state.activitySelectModal ? true : false} 
              getActivity={(activity_id) => this.getActivity(activity_id)}
              dismissModal={() => this.setState({activitySelectModal: null})}
              />

              <View style={appStyle.headingBox}>
                <Text style={[appStyle.H3, {textAlign: "center"}]}>DEVELOPER PANNEL</Text>
              </View>


              <View style={{width: "100%", alignItems: "center"}}>
                <Text style={appStyle.H4}>Program Options</Text>
                <View style={developerStyle.devControlsBox}>
                  <Button title="Log A Mood" onPress={() => this.setState({showMoodModal: true})}/>
                </View>

                <HLine />

                <Text style={appStyle.H4}>Wipe All Data</Text>
                <View style={developerStyle.devControlsBox}>
                  <Button title="Clear ALL App Data" onPress={() => clearAllAppData()}/>
                </View>
                <View style={developerStyle.devControlsBox}>
                  <Button title="Log All App Data" onPress={() => getAllAppData().then((data) => console.log("All app data:", data))}/>
                </View>

                <HLine />

                <Text style={appStyle.H4}>API Interaction</Text>
                <View style={developerStyle.devControlsBox}>
                  <Button title="View Specific Activity" onPress={() => this.setState({activitySelectModal: true})} />
                </View>
                <View style={developerStyle.devControlsBox}>
                  <Button title="Get Program and Save" onPress={() => this.program()}/>
                </View>
                <View style={developerStyle.devControlsBox}>
                  <Button title="Submit Fake Survey Response" onPress={() => this.survey()}/>
                </View>
              </View>

            </View>

        </ScrollView>
      </View>
    )
  }
}