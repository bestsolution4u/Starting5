/**
 * Displays the activity screen which plays the selected activity.
 */
import React, {useEffect, useState, createRef } from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, Dimensions, TouchableOpacity, ImageBackground, TextInput, Platform } from 'react-native';
import Video from 'react-native-video';
import { Card , Button, Overlay, Icon } from 'react-native-elements';
import HTML from 'react-native-render-html';

import MusicPlayer from "./musicPlayerScreen";
import ProgressCircle from "../controllers/ProgressCircle";
import { LoadingView, numActivitiesCompleted, getColour, ErrorModal, smallScreenWidth } from "../controllers/helperFunctions";
import { setSavedActivity, deleteSavedActivity, isActivitySaved, programDayToDate, completeActivity, saveJournal } from "../controllers/localDB";
import { getURIPrefix } from "../controllers/remoteDB";
//added
import Slider from '@react-native-community/slider';
import moment from 'moment';

//Styles
import appStyle from '../styles/appStyle';
import activityStyle from "../styles/activityStyle";

//Assets
const s5Coloured = require("../assets/circles/s5-coloured.png");
const flagIcon = require("../assets/icons/flag-icon.png");
const flagIconFilled = require("../assets/icons/flag-icon-filled.png");
const backetballIcon = require("../assets/backetball-icon.png");
const shootingHoops = require("../assets/shooting-hoops-graphic.png");

//Dummy placeholder images
const activityImage = require("../assets/images/person-standing-on-a-rock.jpg");

/**
 * Displays some stat about the progress of the program, or
 * average activity completion.
 * TBA
 *
 * Requires: "progress" prop with a value from 0 to 1.
 */
const ProgressIcon = (props) => {

  //Make sure to check that data is valid before rendering it - lifecycle errors and such
  return(
      <View style={activityStyle.progressCircle} >
        <ProgressCircle
            value={props.progress}
            size={120}
            thickness={6}
            color={appStyle.pinkColour.backgroundColor}
            animationMethod="timing"
            animationConfig={{speed: 1}}
        />
        <View style={{position: "absolute"}}>
          <Image source={backetballIcon} style={activityStyle.activityCompleteIcon} />
        </View>
      </View>
  )
}

/**
 * This is displayed when an activity is complete, but all five aren't yet complete
 * @param {} props
 */
const SomeActivitiesComplete = (props) => {
  return(
      <View style={[{alignContent: "center", alignItems: "center", justifContent: "center"}, props.width < smallScreenWidth ? {marginBottom: 10} : {marginBottom: 50}]}>

        <View>
          <Image source={s5Coloured} style={[activityStyle.s5Complete, {top: -50}]} />

        </View>

        <Text style={[appStyle.H2, {textAlign: "center", color: "white"}]}>AMAZING WORK!</Text>

        <ProgressIcon progress={(props.completedActivities / 5)}/>

        <Text style={[appStyle.H4, {textAlign: "center", color: "white"}]}>You have completed {props.completedActivities} of your Starting Five</Text>
        <Text style={[appStyle.H4, {textAlign: "center", marginTop: 20}, appStyle.greenFontColour]}>Only {5 - props.completedActivities} activities to go.</Text>
      </View>
  )
}

const AllActivitiesComplete = (props) => {
  return(
      <View style={[{ width: "90%", alignContent: "center", alignItems: "center", justifContent: "center"}, props.width < smallScreenWidth ? {marginBottom: 10} : {marginBottom: 50}]}>
        <View>
          <Image source={s5Coloured} style={[activityStyle.s5Complete, {width: 80, height: 80, top: -50}]} />

        </View>

        <Text style={[appStyle.H2, {textAlign: "center", color: "white"}]}>STARTING FIVE COMPLETE!</Text>

        <Image source={shootingHoops} style={[{resizeMode: "contain", alignSelf: "center", marginTop: 10}, props.width < smallScreenWidth ? {height: 140} : {height: 180}]} />

        <Text style={[appStyle.H4, {textAlign: "center", color: "white", marginTop: 20}]}>Come back tomorrow for your next Starting Five.</Text>
        <Text style={[appStyle.H4, {textAlign: "center", fontSize: 14, textDecorationLine: "underline", marginTop: 20}, appStyle.greenFontColour]}>Complete an extra activity from your favourites</Text>
      </View>
  )
}

/**
 * A modal to show when the activity is complete.
 *
 * required props:
 * today - the full day data
 * slot - the slot in which the completed activity was in
 * activity - the current activity that was completed
 * activityRef - slot / activity index numbers {slot: int, index: int}
 * activitySaved - boolean TRUE if the current activity is saved
 * clearModal - a callback function to close this modal from the calling function
 */
export const ActivityCompleteModal = (props) => {

  //Number of completed activities today -- only if data is valid
  const completedActivities = props.today ? numActivitiesCompleted(props.today) + 1 : 0;
  const width = Dimensions.get("window").width;

  return (
      <Overlay isVisible={props.showModal}
               overlayStyle={activityStyle.activityCompleteModalBox}
      >
        <View style={{flex: 1}}>

          <View style={activityStyle.activityCompleteHeaderBox}>
            {/* Save activity flag and header image */}
            <TouchableOpacity style={activityStyle.activityCompleteIconBox}
                              onPress={() => props.saveActivity(!props.activitySaved)}
            >
              <Image style={activityStyle.saveActivityIcon} source={props.activitySaved ? flagIconFilled : flagIcon} />
            </TouchableOpacity>
          </View>


          <View style={{flex: 3, justifyContent: "center", alignItems: 'center'}}>

            {/* Body Text - depending on if all activites are complete, or jsut a couple */}
            {
              completedActivities > 4 ?
                  <AllActivitiesComplete width={width}/>
                  :
                  <SomeActivitiesComplete completedActivities={completedActivities} width={width}/>
            }
          </View>


          <View style={[{flex: 1, alignItems: "center", marginTop: 20}]}>

            {/* Complete / Done button */}
            <TouchableOpacity
                onPress={() => props.clearModal(true)}
                style={{alignItems: "center", marginBottom: 10}}
            >
              <View style={[activityStyle.circleIcon, {borderColor: getColour("green")}]}>
                <Icon name={"check"}
                      type="font-awesome"
                      size={20}
                      color={appStyle.greenColour.backgroundColor}
                />
              </View>
              <Text style={[appStyle.secondaryButtonText]}>DONE</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Overlay>
  );
}


/**
 * Rest Modal appears between tasks in an activity and counts down
 * to the next task (in a workout).
 *
 * Props:
 *  - totalTime - total time to count down
 *  - currentTime - current counting down time
 *  - pauseTimer - pause button callback
 *  - showModal - visibble status of the modal
 *  - exitActivity - callback to exit the whole activity
 */
export const RestModal = (props) => {
  const timeRemaining = ((props.currentTime) / 1000) / props.totalTime;
  const secondsString = (props.currentTime / 1000) % 60 < 10 ? "0" + ((props.currentTime / 1000) % 60).toString() : ((props.currentTime / 1000) % 60).toString();
  const minutesString = (Math.floor((props.currentTime / 1000) / 60)) < 10 ? "0" + Math.floor((props.currentTime / 1000) / 60).toString() : Math.floor((props.currentTime / 1000) / 60).toString()

  return (
      <Overlay isVisible={props.showModal}
               overlayStyle={activityStyle.restModalBox}
      >
        <View style={{flex: 1, height: "100%", justifyContent: "center", alignItems: "center"}}>


          {/* The back / close button */}
          <TouchableOpacity
              onPress={() => props.exitActivity()}
              style={[activityStyle.circleIcon, {position: "absolute", right: 20, top: 30}]}
          >
            <Icon name={"times"}
                  type="font-awesome"
                  size={20}
            />
          </TouchableOpacity>

          {/* Rest and timer text */}
          <View style={{width: "90%", top: 30, alignItems: "flex-start", alignSelf: "center", position: "absolute"}}>
            <Text style={[appStyle.H3, {fontFamily: "MonumentExtended-Regular"}]}>{props.text}</Text>
            <Text style={[appStyle.H1, {fontFamily: "MonumentExtended-Regular"}]}>{minutesString}:{secondsString}</Text>
          </View>

          {/* Main central timer icon */}
          <View>
            <View style={{borderWidth: 8, borderRadius: 100, width: 200, height: 200,
              borderColor: "white", justifyContent: "center"}} >
              <ProgressCircle
                  value={timeRemaining}
                  size={200}
                  thickness={8}
                  color={"black"}
                  animationMethod="timing"
                  animationConfig={{speed: 1}}
                  style={{left: -4}}
              />
              <TouchableOpacity
                  onPress={() => props.pauseTimer()}
                  style={{position: "absolute", alignSelf: "center"}}>
                <Icon name={"pause"}
                      type="font-awesome"
                      size={120}
                />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </Overlay>
  );
}

/**
 * Displays a warning modal when quitting an activity to confirm.
 * Required props:
 * showModal - the isVisible flag
 * response() - callback to the calling function with the response
 * noComplete - don't show the "complete activity" button (for Saved activities)
 */
const WarnExit = (props) => {

  return(

      <Overlay isVisible={props.showModal}
               overlayStyle={activityStyle.warningModalBox}
      >
        <ScrollView>
          <View style={{width: "100%", alignItems: "center"}}>
            <Text style={[appStyle.H3, {color: "white", textAlign: "center", marginBottom: 10}]}>
              Are you sure you want to exit this workout?
            </Text>

            <TouchableOpacity style={appStyle.defaultWhiteButton}
                              onPress={() => props.response("exit")}
            >
              <Text style={appStyle.buttonText}>Yes, exit the workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={appStyle.defaultWhiteButton}
                              onPress={() => props.response("noexit")}
            >
              <Text style={appStyle.buttonText}>No, continue with the workout</Text>
            </TouchableOpacity>

            {/* Don't show the option to complete if this is a saved activity */}
            {props.noComplete ?
                null
                :
                <TouchableOpacity style={appStyle.defaultWhiteButton}
                                  onPress={() => props.response("complete")}
                >
                  <Text style={appStyle.buttonText}>Mark as complete</Text>
                </TouchableOpacity>
            }

          </View>
        </ScrollView>
      </Overlay>
  )
}


const JournalHeading = (props) => {

  return(
      <View>
        <View style={[appStyle.headingBox, {borderColor: "white", backgroundColor: "white"}]}>
          <Text style={[appStyle.H3, {textAlign: "center"}]}>{props.heading}</Text>
        </View>
        <Text style={[appStyle.H4, {width: "100%", textAlign: "center"}]}>{props.subHeading}</Text>
      </View>
  )
}

const JournalInput = (props) => {
  //Check if this item is checked
  let isChecked = false;
  for(let i = 0; i < props.itemValues.length; i++) {
    if(props.itemValues[i].index == props.index) {
      isChecked = true;
    }
  }

  return(
      <View style={{flexDirection: "row", width: "100%", height: 60, alignItems: "center", justifyContent: "center"}}
      >
        <View style={{borderWidth: 4, borderRadius: 16, height: 32, width: 32, position: "absolute", left: 14}} />
        {isChecked ?
            <Icon name={"check-circle"}
                  type="font-awesome"
                  size={32}
                  color={"black"}
                  containerStyle={{position: "absolute", left: 16}}
            />
            :
            null
        }
        <TextInput style={[activityStyle.textInput, appStyle.H3]}
                   numberOfLines={1}
                   editable={true}
                   textContentType={"none"}
                   onChangeText={(value) => props.updateItems({index: props.index, value: value})}
        />
      </View>
  )
}

/**
 * this is progress bar
 * props - position, duration, videoPlayer
 * 
 * - By Ernest (Freelancer)
 */
const ProgressBar = (props) => {
  // const {config} = useAppSettingsState();
  // const styles = useStyles(config.style);
  // const globalStyle = {...config.style};

  const {position, duration, videoPlayer} = props;

  const [sliderValue, setSliderValue] = useState(0);

  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
  }, [position, duration]);

  const slidingStarted = () => {
    setIsSeeking(true);
    props.isLoading(true);
  };

  const slidingCompleted = async value => {
    videoPlayer.current.seek(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  let width = Platform.OS === 'android' ?
      Dimensions.get('window').width
      :
      Dimensions.get('window').width;

  return (
      <>
        <View style={{alignItems: 'center'}}>
          <Slider
              style={{width: width, height: 40, backgroundColor: '#000'}}
              minimumValue={0}
              maximumValue={1}
              value={sliderValue}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#fff"
              thumbTintColor="#fff"
              onSlidingStart={slidingStarted}
              onSlidingComplete={slidingCompleted}
          />
        </View>
        {/*}
        <View style={{flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between'}}>
          <Text>{moment('1900-01-01 00:00:00').add(position, 'seconds').format('HH:mm:ss')}</Text>
          <Text>{moment('1900-01-01 00:00:00').add(duration, 'seconds').format('HH:mm:ss')}</Text>
        </View>
        */}
      </>
  );
};



/**
 * Displays a video to the screen with some basic controls.
 *
 * Required props:
 * media_src (string)
 * isLoading callback for main function
 */

class VideoActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      paused: false, //The play / paused state of the video
      width: 100,
      height: 100,
      currentPlaybackTime: 0,
      showOverlay: false, //The play/pause overlay screen
      OS: Platform.OS, //operating system
      height: Dimensions.get("window").height, //Screen dimensions
      width: Dimensions.get("window").width,
      naturalSize: null, //Video dimensions
      duration: null, //video duration,
      //added
      position: 0, // progress position
      startPos: 0, // Start position
    };

    this.ref = createRef()

    Dimensions.addEventListener("change", (e) => {
      this.setState(e.window);
    });
  }


  //Measure the window we're looking at for proper centering
  componentDidMount() {

  }

  componentDidUpdate() {
    if(this.ref) {

    }

  }

  // added new
  onProgress(currentTime) {
    this.setState({
      ...this.state,
      position: currentTime
    })
  }
  endVideo() {
    this.ref.current.seek(0)
    this.props.videoEnd();
  }

  render() {
    //Calculate video height based on screen
    let vHeight = this.state.OS == 'ios' ? this.state.height - 80 : this.state.height - 140;
    this.state.naturalSize ? vHeight = ((this.state.naturalSize.height * this.state.width) / this.state.naturalSize.width) : null;

    //Previous values for screen style: {width: this.state.width, height: vHeight}, resizeMode: contain

    return(
        <View>
          <View>
            <Video
                ref={this.ref}
                key={this.props.taskNumber}
                source={{uri: this.props.media_src}}
                style={[activityStyle.videoBox, {height: this.state.height-40}]}
                onError={(err) => {console.log("video error: ", err); this.props.isLoading(false); this.props.isError(true)}}
                onBuffer={({ isBuffering }) => this.props.isLoading(isBuffering)}
                onReadyForDisplay={() => {this.props.isLoading(false)}}
                onEnd={() => this.endVideo()}
                onProgress={({currentTime}) => {
                  this.props.progress(parseInt(currentTime))
                  this.onProgress(currentTime)
                }}
                onLoadStart = {() => {this.props.isLoading(false)}}
                onLoad={({duration, naturalSize}) => {
                  this.props.duration(duration);
                  this.setState({naturalSize, duration});
                  this.ref.current.seek(this.state.position);
                }}
                progressUpdateInterval={500.0}
                paused={this.props.paused}
                repeat={false}
                muted={false}
                ignoreSilentSwitch={"ignore"}
                volume={0.5}
                resizeMode={"cover"}
                minLoadRetryCount={10}
                bufferConfig={{
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 5000
                }}
            />

          </View>
          <ProgressBar position={this.state.position} duration={this.state.duration} videoPlayer={this.ref} isLoading={this.props.isLoading}/>
        </View>

    )
  }
}

/**
 * The initial entry point which displays the introduction page and then plays the full activity.
 *
 * Required props:
 * activity - the current activity to run
 * today - daily data for today
 * activityRef - slot/activity index of this activity {slot: index, index: activitiy index}
 * (optional) completeActivity - Force the activity to complete immediately
 */
export class ActivityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, //The video or media is still loading
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      isError: false, //Display the error message
      taskNumber: 0, //The number of the current task within this activity
      isActivityComplete: false, //If the whole activity is complete
      thisActivity: this.props.route.params.activity, //The current activity from parent
      today: this.props.route.params.today, //The daily data for the whole day
      activityRef: this.props.route.params.activityRef, //slot and activity index of this activity
      warningModal: false, //Displays a modal message box warning the user if they try to quit
      warningModalResponse: null, //Response from the warning modal message
      restModal: false, //Displays the rest modal between tasks
      restCountdown: 0, //If multitask activity then this controlls the countdown
      restModalText: "GET READY...", //Text to show in the modal
      intervalTimer: null, //Interval timer for countdowns
      videoProgress: 0, //The progress timer (in seconds) for the video
      videoDuration: 0, //Total duration of the video
      videoEnd: false, //has the video ended
      pauseVideo: false, //The video pause / play callback
      audioPlayerRef: null, //A reference to the audio player itself
      activitySaved: false, //The current activities saved state (for the save activities feature)
      saveActivity: null, //Callback to save / unsave the activity from the activity complete modal
      uriPrefix: null, //Cloud server URI
      playerRef: null, //Reference for the media player
      journalItemValues: [], //An array to store the journal text input stuff
      displayOnly: this.props.route.params.displayOnly ? this.props.route.params.displayOnly : false, //If this is TRUE then activity cant be completed, only viewed. For saved activity display
    };
    Dimensions.addEventListener("change", (e) => {
      this.setState(e.window);
    });
  }

  //Measure the window we're looking at for proper centering
  componentDidMount() {

    //Is the current activity in the user's saved list
    isActivitySaved(this.state.thisActivity).then((result) =>
        this.setState({activitySaved: result})
    );

    //If the activity was flagged for automatic completion by the calling function, then complete it right away
    if(this.props.route.params.completeActivity) {
      this.completeActivity();
    }

    //Get the cloud URL for fully qualified addresses
    getURIPrefix().then((prefix) => this.setState({uriPrefix: prefix}));

    console.log("activity reference:", this.state.activityRef);
    console.log("activity display Only:", this.state.displayOnly);
    console.log("activity day:", this.state.thisActivity.day_of_program);

  }

  //If one of the child components reported a change
  componentDidUpdate() {
  }

  //Unsubscribe any async tasks
  componentWillUnmount() {
    this.setState({pauseVideo: true});
  }

  /**
   * Logic to handle the responses from the "exit" modal box.
   * @param string response
   */
  exitResponse(response) {
    //Clear the modal
    this.setState({warningModal: false, warningModalResponse: null});

    switch(response) {
      case("exit"):
        //Exit the activity
        this.props.navigation.navigate("HomeTabs");
        break;
      case("noexit"):
        //Unpause the video
        this.setState({pauseVideo: false});
        break;
      case("complete"):
        //mark the activity as complete
        this.setState({taskNumber: this.state.thisActivity.tasks.length - 1}, this.doCompleteActivity());

        break;
    }
  }

  /**
   * Completes one task out of the activity.
   * Displays the "activity complete" modall if this is the final
   * task.
   */
  completeTask() {
    //Destroy the audio player
    this.setState({audioPlayerDestroy: true});

    //Is this a multi-task activity which needs a rest period
    let isMultiTask = false;
    this.state.thisActivity.tasks[this.state.taskNumber].task_autoprogress_time > 0 ? isMultiTask = true : null;
    //Also don't show the rest if this is the final task
    this.state.taskNumber + 1 == this.state.thisActivity.tasks.length ? isMultiTask = false : null;
    //If it is a multi task activity then set a timer and interval countdown
    if(isMultiTask) {
      this.setState({restCountdown: (this.state.thisActivity.tasks[this.state.taskNumber].task_autoprogress_time) * 1000, restModal: true,  
        restModalText: "REST", intervalTimer: setInterval(() => this.setState({restCountdown: this.state.restCountdown - 1000}), 1000)});
      setTimeout(() => {
        this.setState({restModal: false, pauseVideo: false});
        clearInterval(this.state.intervalTimer);
      }, (this.state.thisActivity.tasks[this.state.taskNumber].task_autoprogress_time) * 1000);
    }

    //if there are more tasks to show, then move to the next one
    if(this.state.taskNumber < (this.state.thisActivity.tasks.length) ) {
      //In the special case where we just finished the last task then complete the activity
      if((this.state.taskNumber + 1) == this.state.thisActivity.tasks.length) {
        //Only complete the activity if this is NOT a saved activity, otherwise just exit
        if(this.state.displayOnly) {
          //Exit the activity
          this.props.navigation.navigate("HomeTabs");
        } else {
          this.doCompleteActivity();
        }
      } else {
        //Otherwise just move to the next task
        this.setState({isLoading: true, taskNumber: this.state.taskNumber + 1});
        //Player reference
        if(this.state.playerRef) {
          this.state.playerRef.seek(200);
        }
      }
    }
  }

  /**
   * Logic when a daily is activity is completed. Marks it as complete,
   * and then shows the "activity complete" modal.
   */
  doCompleteActivity() {
    this.setState({isActivityComplete: true, pauseVideo: true});

    //If this is a journal then save the journal data
    if(this.state.journalItemValues) {
      saveJournal({activity_id: this.state.thisActivity.activity_id, journal: this.state.journalItemValues});
    }

    //Save the completed activity
    completeActivity(this.state.thisActivity.day_of_program, this.state.activityRef);

    if(this.props.forceRefresh) {
      this.props.forceRefresh();
    }
  }

  /**
   * Save activity callback function
   */
  saveActivity(state) {
    //Update the graphic state
    this.setState({activitySaved: state});

    //Delete or add the item appropriately
    if(state) {
      setSavedActivity(this.state.thisActivity);
    } else {
      deleteSavedActivity(this.state.thisActivity);
    }
  }

  /**
   * Called by ActivityCompleteModal to close the modal and change screens
   */
  closeActivity() {
    this.props.navigation.navigate("HomeTabs");
  }

  /**
   * Callback for when a video has ended
   */
  videoEnd() {
    //If the video has finished, and auto_progress is set, then progress to the next task
    if(this.state.videoDuration > 0 &&
        this.state.thisActivity.tasks[this.state.taskNumber].task_autoprogress ) {
      this.completeTask();
    }
  }

  /**
   * Updates the journal text input store with new input
   *
   * TODO: this is hacky but I'm in a hurry. maybe fix later
   */
  updateJournalInput(newValue) {
    let newJournalItemValues = this.state.journalItemValues;
    let found = 0;
    for(let i = 0; i < newJournalItemValues.length; i++) {
      if(newJournalItemValues[i].index == newValue.index) {
        newJournalItemValues[i] = newValue;
        found++;
      }
    }

    if(found == 0) {
      newJournalItemValues.push(newValue);
    }

    this.setState({journalItemValues: newJournalItemValues});
  }

  render() {
    //Flag this as a video activity, or not
    const isVideo = this.state.thisActivity.tasks[this.state.taskNumber].media_type == "V" ? true : false;
    const isAudio = this.state.thisActivity.tasks[this.state.taskNumber].media_type == "A" ? true : false;
    const isImage = this.state.thisActivity.tasks[this.state.taskNumber].media_type == "I" ? true : false;
    const isJournal = this.state.thisActivity.tasks[this.state.taskNumber].task_user_input_count > 0 ? true : false;

    //Width of the task marker beans
    const taskBeanWidth = (100 / this.state.thisActivity.tasks.length) + "%";
    //Calculate the video time and conver to hh:mm format
    var videoTime = new Date(0, 0);
    videoTime.setSeconds(this.state.videoDuration - this.state.videoProgress);
    //var videoDuration = new Date(0, 0);
    //videoDuration.setSeconds(this.state.videoDuration);
    //The HTML object for the webview
    const webViewStyle = "<style> p { font-size: 48; } </style>";
    const activityDescription = this.state.thisActivity.tasks[this.state.taskNumber].task_content;

    //Determine the image to display. Start with a backup image, and then load the specified image
    let thisImage = activityImage;
    let imageURI = null;
    let nextTaskImage = null;
    //When the full URL is available, then reference the remote image
    if(this.state.uriPrefix) {
      if(this.state.thisActivity.tasks) {
        imageURI = {uri: this.state.uriPrefix + this.state.thisActivity.tasks[this.state.taskNumber].media_image};
        this.state.taskNumber < (this.state.thisActivity.tasks.length - 1) ?
            nextTaskImage = {uri: this.state.uriPrefix + this.state.thisActivity.tasks[this.state.taskNumber + 1].media_image}
            :
            null
      }
    }


    return (
        <View style={appStyle.mainBox}>
          <View style={{flex: 1, width: "100%"}}>
            {/* Only allow scroll if this is NOT a video */}
            <ScrollView scrollEnabled={isAudio || isVideo ? false : true}>


              {/* Activity Title */}
              <View style={activityStyle.titleOverlay}>
                {/* The top markers to show the task progress beans */}
                <View style={activityStyle.taskBeansBox}>
                  {
                    false ?
                        this.state.thisActivity.tasks.map(
                            (item, index) =>

                                <View style={[
                                  activityStyle.taskBean,
                                  {width: taskBeanWidth},
                                  index <= this.state.taskNumber ? {backgroundColor: "black"} : {backgroundColor: "gray"}
                                ]} key={index} />

                        )
                        :
                        null
                  }
                </View>



                <View style={{flexDirection: "row", marginTop: 20, paddingRight: 20, width: "100%", justifyContent: "flex-end"}}>

                  {/* The title line, and the video timer only show if video */}
                  {
                    isVideo ?
                        <View style={{flex: 1, alignItems: "flex-start", marginLeft: 30}}>
                          <Text style={[appStyle.H4, {fontFamily: "MonumentExtended-Regular"}]}>{this.state.thisActivity.tasks[this.state.taskNumber].task_label.toUpperCase()}</Text>
                          <Text style={[appStyle.H1, {fontFamily: "MonumentExtended-Regular"}]}>{videoTime.toTimeString().slice(3, 8)}</Text>
                        </View>
                        :
                        null
                  }
                  {/* The back / close button */}
                  <TouchableOpacity
                      onPress={() => this.setState({warningModal: true, pauseVideo: true})}
                      style={activityStyle.circleIcon}
                  >
                    <Icon name={"times"}
                          type="font-awesome"
                          size={20}
                    />
                  </TouchableOpacity>



                </View>
              </View>


              {/* Show the video if this is a video task */}
              <View style={{flex: 1, justifyContent: "center"}}>
                {/* If an error was reported then display a message */}
                <ErrorModal showError={this.state.isError ? true : false} error={"There was an error loading the video."} dismissError={() => this.setState({isError: false})} />

              {/* If we are showing video content then play the video */ }
              {isVideo && this.state.uriPrefix ? 
                <VideoActivity media_src={this.state.uriPrefix + this.state.thisActivity.tasks[this.state.taskNumber].media_link} 
                  //If loading is complete, BUT the rest screen is displayed, then pause the video
                  isLoading={(loading) => this.state.restModal & !loading ? 
                    this.setState({isLoading: loading, pauseVideo: true}) : this.setState({isLoading: loading})} 
                  isError={(error) => this.setState({isError: error})} 
                  isTaskComplete={(complete) => this.completeTask()}
                  progress={(progress) => this.setState({videoProgress: progress})}
                  paused={this.state.pauseVideo}
                  duration={(duration) => this.setState({videoDuration: duration})}
                  videoEnd={() => this.videoEnd()}
                  setPlayerRef={(ref) => this.setState({playerRef: ref})}
                  taskNumber={this.state.taskNumber}
                  key={this.state.taskNumber}
                />
              :
                null
              }


              {/* There will almost always be some loading. But this may be cleared straight away, or by the video loader. */}
              <LoadingView isLoading={this.state.isLoading} style={{zIndex: 999, position: "absolute", top: 100, left: (this.state.width / 2) - 65}} />


              {/* Display journal text input boxes */}
              {isJournal ?
                  <View style={{ width: "100%", top: 40, minHeight: 200, marginBottom: 40}} >
                    <JournalHeading heading={this.state.thisActivity.tasks[this.state.taskNumber].task_label.toUpperCase()}
                                    subHeading={this.state.thisActivity.tasks[this.state.taskNumber].task_content}
                    />
                    {
                      new Array(this.state.thisActivity.tasks[this.state.taskNumber].task_user_input_count).fill([]).map(
                          (item, index) => <JournalInput key={index} index={index}
                                                          itemValues={this.state.journalItemValues}
                                                          updateItems={(newValues) => this.updateJournalInput(newValues)}
                          />)
                    }

                  </View>
                  :
                  null
                }

                {/* If it's not a video then cancel the loading box */}
                {!isVideo ?
                    this.state.isLoading ? this.setState({isLoading: false}) : null
                    :
                    null
                }

                {/* If we have an image type activity then display a 1/3rd screen image */}
                {!isVideo && !isJournal ?
                    <View style={appStyle.mainImageBox}>
                      <Image source={imageURI ? imageURI : thisImage}
                             style={[activityStyle.mainImage,
                               {height: this.state.height},
                               this.state.thisActivity.activity_focus == "F" ? {resizeMode: "contain"} : {resizeMode: "cover"}]}
                             onLoad={() => this.setState({isLoading: false})}
                      />
                    </View>
                    :
                    null
                }

                {/* If it's an audio task then try and play it in the video player */}
                {isAudio && this.state.uriPrefix ?
                    <MusicPlayer media_src={this.state.uriPrefix + this.state.thisActivity.tasks[this.state.taskNumber].media_link}
                                 taskNumber={this.state.taskNumber}
                                 activity={this.state.thisActivity}
                                 key={this.state.taskNumber}
                                 paused={this.state.pauseVideo}
                                 authorImage={this.state.uriPrefix + this.state.thisActivity.author_image}
                    />
                    :
                    null
                }
              </View>

              {/* Bottom video controls */}
              {isVideo || isAudio ?
                  <View style={{position: "absolute",
                    height: 80, width: "100%", top: this.state.height - 120,
                    flexDirection: "row", alignItems: "center", justifyContent: "center",
                    paddingLeft: 20, paddingRight: 20}}>
                    {/* If this is a short task then skipping should end the task.
                If it is a long video then it should jump forward / back 10 seconds in the video */}
                    {this.state.taskNumber > 0 ?
                        <TouchableOpacity
                            style={[activityStyle.videoButton, {position: "absolute", left: 20, justifyContent: "center"}]}
                            disabled={this.state.taskNumber > 0 ? false : true}
                            onPress={() => this.setState({taskNumber: this.state.taskNumber - 1})}
                        >
                          <Icon name={"angle-left"}
                                type="font-awesome"
                                color={"black"}
                                size={30}
                                containerStyle={{left: -3, top: 0}}
                          />
                        </TouchableOpacity>
                        :
                        null
                    }

                    {/* Temporarily disable this button on audioi activities because it doesn't work */}
                    {isAudio ? null :
                        <TouchableOpacity
                            style={[activityStyle.videoButton, {justifyContent: "center"}]}
                            onPress={() => this.setState({pauseVideo: !this.state.pauseVideo})}
                        >
                          {/* Select play / pause icon */}
                          {this.state.pauseVideo ?
                              <Icon name={"play"}
                                    type="font-awesome"
                                    size={20}
                                    color={"black"}
                                    containerStyle={{left: 2}}
                              />
                              :
                              <Icon name={"pause"}
                                    type="font-awesome"
                                    color={"black"}
                                    size={20}
                              />
                          }
                        </TouchableOpacity>
                    }
                    {/* disable if this is a long video */}
                    {this.state.videoDuration < 60 ?
                        <TouchableOpacity
                            style={[activityStyle.videoButton, {position: "absolute", right: 20, justifyContent: "center"}]}
                            onPress={() => this.completeTask()}
                        >
                          <Icon name={"angle-right"}
                                type="font-awesome"
                                color={"black"}
                                size={30}
                                containerStyle={{right: -3, top: 0}}
                          />
                        </TouchableOpacity>
                        :
                        null
                    }
                  </View>
                  :
                  null
              }

              {/* Towards the bottom of the screen is the activity blurb whicih may be big or small */}
              <View style={activityStyle.bottomContentBox}>
                {this.state.thisActivity.tasks[this.state.taskNumber].task_content == "" ?
                    null
                    :
                    <HTML
                        source={{html: webViewStyle + activityDescription}}
                        containerStyle={[activityStyle.webView, isVideo ? null : {height: this.state.height - activityStyle.mainImage.height - 20}]}
                    />
                }
              </View>


              {/* The modal to display when an activity is complete */}
              <ActivityCompleteModal showModal={this.state.isActivityComplete}
                                     clearModal={(complete) => this.closeActivity()}
                                     today={this.state.today}
                                     activity={this.state.thisActivity}
                                     activityRef={this.state.activityRef}
                                     saveActivity={(save) => this.saveActivity(save)}
                                     activitySaved={this.state.activitySaved}
              />

              {/* The rest modal to display between tasks */}
              <RestModal showModal={this.state.restModal}
                         totalTime={this.state.restModalText == "REST" ?
                             this.state.thisActivity.tasks[this.state.taskNumber].task_autoprogress_time : 10000}
                         currentTime={this.state.restCountdown}
                         exitActivity={() => this.setState({warningModal: true, pauseVideo: true})}
                         pauseTimer={() => console.log("Pause timer")}
                         text={this.state.restModalText}
              />

              {/* Warning Modal if the user tries to quit mid-activity */}
              <WarnExit showModal={this.state.warningModal} response={(response) => this.exitResponse(response)} noComplete={this.state.displayOnly} />

            </ScrollView>
            {/**
             * Button specif for the journal entries only
             */}
            {isJournal ?
                <View style={{width: "100%", alignItems: "center", alignSelf: "flex-end"}}>
                  <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]} onPress={() => this.completeTask()}>
                    <Text style={appStyle.buttonText}>MARK AS COMPLETE</Text>
                  </TouchableOpacity>
                </View>
                :
                null
            }
          </View>
        </View>
    )
  }
}