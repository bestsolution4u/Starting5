import React from 'react';
import { View, Image, ScrollView, Text, Dimensions, Alert, ImageBackground} from 'react-native';

import MyHeader from "./headerFragment";
import { getUserData, getDayActivities, saveMood, 
    getUsageStats, saveUsageStats, getDayUserData, 
    getDaysSinceProgramStart, saveToolkitActivities, 
    getTodayMoods, programDayToDate, dateToProgramDay,
    getCurrentDate, } from "../controllers/localDB";
import { getColour, numActivitiesCompleted, LoadingModal, ErrorModal, getRestDays } from "../controllers/helperFunctions";
import { getURIPrefix, saveRemoteDayUserData, checkLogin, getRemoteToolkitActivities } from "../controllers/remoteDB";


//Stylesheets
import appStyle from "../styles/appStyle";
import homeStyle from "../styles/homeStyle";

//Fragments to display
import { ActivityFragment, ActivityModal } from "./activityFragment";
import { MoodSelector } from "./moodSelector";

//Assets
const tickImage = require("../assets/tick-icon.png");
const s5Coloured = require("../assets/circles/s5-coloured.png");

/**
 * A circle to display a the top of the page which indicates if an activity is complete.
 * Required props:
 * - activity - an array of activities for this slot
 * - number - the order in the list
 * 
 * @param {*} props 
 */
const ActivityCircle = (props) => {
    const thisActivity = props.activity[0];

    
    //Calculate the appropriate circle colour (complete or not complete)
    var circleColour = "gray";
    var textColour = "gray";
    var backgroundColour = null;
    //check if data is valid first
    if(thisActivity) {
        circleColour = thisActivity.complete ? getColour("pink") : "#ABABAB";
        textColour = thisActivity.complete ? "black" : "#ABABAB";
        backgroundColour = thisActivity.complete ? "white" : null;
    }

    return(
        <View style={[homeStyle.activityCircle, {borderColor: circleColour, backgroundColor: backgroundColour}]} 
            key={props.number}>
            <Text style={[appStyle.H1, {color: textColour, marginTop: 5}]}>{props.number + 1}</Text>
        </View>
    )
}

const RestDay = (props) => {
    const message = "Taking care of yourself is productive."

    return(
        <View style={[homeStyle.restDayBox]}>

            <Image source={s5Coloured} style={homeStyle.restDayImage} />
            
            <View style={{marginTop: 40, width: "80%"}}>
                <Text style={[appStyle.H2, {color: "white", textAlign: "center", lineHeight: 40}]}>
                    {message.toUpperCase()}
                </Text>
                <Text style={[appStyle.H4, appStyle.greenFontColour, {textAlign: "center", marginTop: 80}]}>
                    Check in tomorrow for your next daily five.
                </Text>
            </View>

        </View>
    )
}

/**
 * The Home Screen displays a dashboard of current task progress, as well as
 * a sample of tasks yet to be completed, and an encouragement message.
 */
export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: Dimensions.get("window").height, //the display height
            width: Dimensions.get("window").width, //The display width
            currentDay: new Date().getDate(), //Day of the month
            currentTime: new Date().getHours(), //Current time of day
            programDay: null, //Day of the program
            today: new Array(5).fill([]), //The full daily data
            activityModal: null, //The activity data being passed to the activity modal
            showActivityModal: false,
            activityRef: null, //Reference to which ever activity is selected. {slot: index, index: activity index}
            showMoodModal: false, //Display / hide the mood modal
            usageStats: null, //The usage statistics from the database
            userData: null, //User credentials
            isLoading: false, //loading modal
            URIPrefix: null, //uri for image loading
            error: null, //An error message that can be customised
            restDay: false, //Flag as true if today is a rest day
        };
    }

    //Logic to retreive the daily data from the data store and udpate the state
    loadLocalData() {
        //Show loading dialog
        this.setState({isLoading: true});

        //Get some activities to display for today
        getDaysSinceProgramStart().then((programDay) => {
            //If there is no program start day then something has gone horribly wrong
            if(!programDay) {
                Alert.alert("Missing Data", "There seems to be problem with the data stored for the app. Please try log in again.");
                this.props.navigation.navigate("LOG OUT");
            }
            
            //Record the day
            this.setState({programDay});

            //Get the program for today
            getDayActivities(programDay).then(result => {
                console.log("home screen day: ", programDay);
                //Hide the loading modal
                this.setState({isLoading: false});

                //Check if there actually is data for today and update the state, otherwise do nothing
                if(result) {
                    let program = result;
                    if(program[0][0]) {
                        this.setState({today: program});
                        console.log("activty day found:", program[0][0].day_of_program);

                        //In the special case where all activities were completed
                        //The user should be asked to record their mood again
                        //Check that they haven't already recorded it twice today
                        //Also make sure the data has loaded first
                        if(numActivitiesCompleted(result) == 5) {
                            //If less than two moods entered today, then ask to enter again
                            getTodayMoods().then((dayMoods) => {
                                if(dayMoods) {
                                    if(dayMoods.length < 2) {
                                        this.setState({showMoodModal: true});
                                    }
                                }
                            });
                        }
                    } else {
                        this.setState({error:"There was a problem with the program data provided by the server. Please log out and then log back in.", isLoading: false});
                    }
                }
            });
        }).catch(() => {
            Alert.alert("Missing Data", "There was a problem with the data for the app. Please try logging back in, if the problem keeps occusing contact Starting Five for support.");
            this.props.navigation.navigate("LOG OUT");
        });

        getRestDays().then((days) => {
            console.log("home screen / rest days:", days);
            //This is the question about rest days
            //Is today a rest day
            const thisDay = new Date().getDay();
            if(days) {
                for(let j = 0; j < days.length; j++) {
                    if(thisDay == days[j]) {
                        console.log("rest day!", thisDay);
                        this.setState({restDay: true});
                    }
                }
            }
        });

        //Save data to the cloud
        getDayUserData(getCurrentDate()).then((dayData) => {
            console.log("Saving data to cloud:", dayData);
            saveRemoteDayUserData(getCurrentDate(), dayData);
        });
    }

    //Load local data from the database
    componentDidMount() {

        //Check a user's login creds and show an error if they fail.
        checkLogin().then((status) => {
            console.log("Login Auth Status:", status);
            if(!status.user_credential && status != "Network Error"){
                Alert.alert("Login Failure", "There was a problem with your login details. This is usually caused by logging in to another device. Try logging back in again.");
                this.props.navigation.navigate("LOG OUT");
            }
        });

        //Get the URI prefix to use for media links - THEN load local data
        getURIPrefix().then((uri) => this.setState({URIPrefix: uri}, this.loadLocalData()));

        //Items to complete on first-run only: like usage stats
        //Update the usage statistics
        getUsageStats().then((result) => {
            let usageStats = [];
            //If data is invalid then make some new data
            if(result != null) {
                usageStats = result;
            }

            //Get the current date stamp in the form yyyymmdd for easy sorting
            let dateStamp = getCurrentDate();

            //Check if data is valid
            if(usageStats.length > 0) {
                console.log("day last opened:", usageStats[usageStats.length - 1].day_last_opened, "dateStamp:", dateStamp);
                //Check if this is first run today
                if(usageStats[usageStats.length - 1].day_last_opened < dateStamp) {
                    console.log("First use today");
                    this.firstRunToday();
                }
            } else {
                //Data is invalid... This is also the first run today, or ever
                console.log("first use ever");
                this.firstRunToday();
            }

            //Save the new usage stats
            saveUsageStats({time_last_opened: this.state.currentTime, day_last_opened: dateStamp});
            this.setState({usageStats: {usageStats: result}});
        });
        
        //Get user data
        getUserData().then(result => {
            this.setState({userData: result});
        })

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

    /**
     * Called when the app loads for the first time in the day.
     * Pre-loads images, stores yesterdays data to cloud, and other house keeping.
     */
    firstRunToday() {
        console.log("first run today. Doing some housekeeping");

        //Currently nothing to do here. This function is left in case it is needed in the future.

        //Show the mood select modal
        this.setState({showMoodModal: true});

    }

    
    /**
     * Returns the formatting for each activity slot
     * 
     */
    showActivities(thisSlot, index) {
        //Calculate the tick circle colour based on if the task is complete. Data must be valid first.
        var tickColour = "white";
        var thisTick = null;
        if(thisSlot[0]) {
            thisSlot[0].complete ? tickColour = "black" : tickColour = "white";
            thisSlot[0].complete ? thisTick = tickImage : thisTick = null;
        }

        return(
            <View key={index} style={homeStyle.elementBox}>
                {/* we draw a circle and/or tick for completed items. 
                * for the special case where this is the last item then
                do not draw a line, only a circle */}
                <View style={[homeStyle.verticalLine, index == 4 ? {height: 0} : {height: "100%"}]} />
                <ImageBackground source={thisTick} style={[homeStyle.tickCircle, {backgroundColor: tickColour}]} />

                <ActivityFragment 
                activityDetails={
                    //if the slot is NOT empty, AND the activity is complete then only pass one item
                    thisSlot.length > 0 ?
                        thisSlot[0].complete ?
                            [thisSlot[0]]
                            :
                            thisSlot
                        :
                        thisSlot
                }
                activityModal={(show, activityModal, activityRef) => this.setState({showActivityModal: show, activityModal, activityRef})}
                slotIndex={index}
                navigation={this.props.navigation}
                forceRefresh={() => this.loadLocalData()}
                />
            </View>
        )
    }

    /**
     * Saves the slider values from the mood selector modal.
     * 
     * Expects an object of the form {mood: float, energy: float, motivation: float}
     * 
     * @param {*} sliderValues 
     */
    saveMood(sliderValues) {
        console.log("save sliders:", sliderValues);

        saveMood(sliderValues);

        //Clear the modal
        this.setState({showMoodModal: false});
    }

    
    render() {
        //Calculate the height of the video to be 1/3rd screen
        //This is overridden by the FlexBox property anyway (I think)
        const { width, height } = Dimensions.get("window");

        return (
            <View style={appStyle.mainBox}>

                <MyHeader />

                {/* Loading modal */}
                <LoadingModal isLoading={this.state.isLoading} />

                {/* Error Modal */}
                <ErrorModal showError={this.state.error ? true : false} error={this.state.error} dismissError={() => this.setState({error: null})} />
                
                {/* The main content View */}
                <View style={{flex: 1, width: "100%"}}>
                    <ScrollView style={this.state.restDay ? {backgroundColor: "black"} : null}>

                        {/* Show a set of circles with activities complete marked. IF all activities are complete then show a black box */}
                        <View style={homeStyle.circlesBox}>
                            {
                                numActivitiesCompleted(this.state.today) < 5 && !this.state.restDay ?
                                    this.state.today.map((slot, index) => <ActivityCircle activity={slot} 
                                        number={index} 
                                        key={index}  />)
                                :
                                    <View style={homeStyle.allActivitiesCompleteMessage}>
                                        <Text style={[appStyle.H3, {color: "white", textAlign: "center"}]}>{this.state.restDay ? "REST DAY" : "DAILY 5 COMPLETE"}</Text>
                                    </View>
                            }
                        </View>
                        
                        { //If an activity has been selected then show the summary modal with data. Can't instantiate this without data.
                        this.state.showActivityModal ?
                        <ActivityModal activityModal={this.state.activityModal} 
                            showModal={this.state.showActivityModal} 
                            hideModal={(hide) => this.setState({showActivityModal: !hide}) }
                            navigation={this.props.navigation} 
                            today={this.state.today}
                            activityRef={this.state.activityRef}
                            forceRefresh={() => this.loadLocalData()}
                            //Activities that have been completed can be re-played but not completed agian
                            displayOnly={this.state.activityModal.complete ? true : false}
                        />
                        :
                        null
                        }

                        {/* Shows the mood selection modal (should be shown on first run of the day) */}
                        {/* MUST make sure no other modals are going to jump in and clear it */}
                        {this.state.userData && !this.state.isLoading && !this.state.error ? 
                            <MoodSelector showModal={this.state.showMoodModal}
                                hideModal={(hide) => this.setState({showMoodModal: !hide})}
                                saveMood={(sliderValues) => this.saveMood(sliderValues)}
                                name={this.state.userData.first_name}
                            />
                        :
                            null
                        }

                        {/* If this is NOT a rest day then show the activities */}
                        {this.state.restDay ?
                            <RestDay height={this.state.height}/>
                        :
                            <View style={homeStyle.activityListBox}>
                                {/* The list of activities has a row of tick circles down the left, and activity descritions on the right */}
                                {/* Show the activities for each slot */}
                                {
                                    this.state.today.map((slot, index) => this.showActivities(slot, index))
                                }
                            </View>
                        }
                        <View style={{paddingTop: 10}}></View>


                    </ScrollView>
                </View>
            </View>
        );
    }
}