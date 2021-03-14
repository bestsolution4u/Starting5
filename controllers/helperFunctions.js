/**
 * A collection of helpful functions for use throughout the app.
 */
import React from 'react';
import { View, Image, Text, Dimensions, StyleSheet, Modal, ActivityIndicator, TouchableOpacity, Button } from 'react-native';

import { getAllActivities, getDaysSinceProgramStart, getSurveyResponse, 
  getLengthOfProgram, getUserData} from "../controllers/localDB";


import appStyle from '../styles/appStyle';

//Colour definitions
const mindColour = "#97ddf4";
const bodyColour = "#95dabc";
const foodColour = "#f9a89d";
const communityColour = "#b8bee4";
const s5skillsColour = "#b2b1b1";
const greenColour = "#6FEAC3";
const blueColour = "#4EDEEE";
const pinkColour = "#FFA2D4";
const orangeColour = "#FFB284";
const purpleColour = "#D3C4FF";
const greyColour = "#F2F2F2";

//Screen size definitions
export const smallScreenWidth = 331;

//Subscription levels
const proSubscription = 200;
const regularSubscription = 100;
const developerSubscription = 9999;

//Image assets
const s5Circle = require('../assets/s5-coloured-circle.png');
const segmentMask = require('../assets/circles/circle-segment-mask.png');

//Localisations
const monthStrings = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

//Dummy data
const blankActivity = {id: null, type: "", title: "", description: "", duration: "", complete: false, liked: false, media_src: null, text_src: null, other_src: null};

/**
 * Just returns a blank dummy activity for use in testing and while loading
 */
export function getDummyActivity() {
    return({day: null, slots: new Array(5).fill([])});
}

/**
 * This is a universal loading modal. It just displays a loading icon over the top of
 * whatever page you have. It does NOT have any internal logic and visibility should
 * be controllled by the parent.
 * Required props: isLoading
 */
export function LoadingModal(props) {
  return (
    <Modal
    transparent={true}
    animationType={'none'}
    visible={props.isLoading}>
    <View style={appStyle.modalBackground}>
      <View style={appStyle.activityIndicatorWrapper}>
        <ActivityIndicator
          size='large' color={appStyle.H1.color}/>
      </View>
    </View>
  </Modal>
  )
}

/**
 * A custom error message
 * required props:
 * {showError (bool), error (str), dismissError (callback)}
 */
export function ErrorModal(props) {
  return (
    <Modal
    transparent={true}
    animationType={'none'}
    visible={props.showError}>
    <View style={appStyle.modalBackground}>
      <View style={appStyle.errorModalBox}>
        <Text style={appStyle.H3}>{props.error}</Text>

        <TouchableOpacity style={[appStyle.secondaryButton, {width: "90%"}]}
          onPress={() => props.dismissError()}>
          <Text style={appStyle.secondaryButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  )
}

/**
 * This is the same as the loading modal but it just exists in a simple View so that
 * it can be placed anywhere without blocking the screen.
 */
export function LoadingView(props) {
  return (
    <View>
    {props.isLoading ?
      <View style={[appStyle.activityIndicatorWrapper, props.style]}>
        <ActivityIndicator
          size='large' color={appStyle.H1.color}/>
      </View>
    :
      null
    }
    </View>
  )
}

/**
 * Returns the human readable string of the activity focus type,
 * or the original activity_focus if it is not recognised.
 * @param {*} activity 
 */
export function getActivityFocusString(activity) {
  if(activity.activity_focus){
  switch(activity.activity_focus) {
    case("B"):
      return "Body";
      break;
    case("M"):
      return "Mind";
      break;
    case("P"):
      return "Productivity";
      break;
    case("F"):
      return "Food";
      break;
    case("S"):
      return "Self Care";
      break;
    case("C"):
      return "Community";
      break;
  }

  return activity.activity_focus;
} else {
  return "";
}
}

/**
 * Returns the colour of the activity as a hex string.
 * Accepts an activity type. Returns black on error.
 */
export function getActivityColourString(activity) {
  try {
    if(activity.type == "body") {
      return(appStyle.bodyColour.backgroundColor);
    }
    if(activity.type == "mind") {
      return(appStyle.mindColour.backgroundColor);
    }
    if(activity.type == "community") {
      return(appStyle.communityColour.backgroundColor);
    }
    if(activity.type == "food") {
      return(appStyle.foodColour.backgroundColor);
    }
    if(activity.type == "s5skills") {
      return(appStyle.s5SkillsColour.backgroundColor);
    }
  } catch (TypeError) {
    //if an incorrectly formed activity was provided
    return ("#000000");
  }
}

/**
 * Returns the appropriate "backgroundColor" property for the provided focus (string).
 * Accepts an Activity type
 */
export function getActivityBackgroundColour(activity) {
    try {
      if(activity.type.toLowerCase() == "body") {
        return(appStyle.bodyColour);
      }
      if(activity.type.toLowerCase() == "mind") {
        return(appStyle.mindColour);
      }
      if(activity.type.toLowerCase() == "community") {
        return(appStyle.communityColour);
      }
      if(activity.type.toLowerCase() == "food") {
        return(appStyle.foodColour);
      }
      if(activity.type.toLowerCase() == "s5skills") {
        return(appStyle.s5SkillsColour);
      }
    } catch (TypeError) {
      //if an incorrectly formed activity was provided
      return {backgroundColor: "#000000"};
    }
}

/**
 * Returns the appropriate "color property for the provided focus (string).
 */
export function getActivityFontColour(activity) {
    try {
      if(activity.type.toLowerCase() == "body") {
        return(appStyle.bodyFontColour);
      }
      if(activity.type.toLowerCase() == "mind") {
        return(appStyle.mindFontColour);
      }
      if(activity.type.toLowerCase() == "community") {
        return(appStyle.communityFontColour);
      }
      if(activity.type.toLowerCase() == "food") {
        return(appStyle.foodFontColour);
      }
      if(activity.type.toLowerCase() == "s5skills") {
        return(appStyle.s5SkillsFontColour);
      }
    } catch (TypeError) {
      //if an incorrectly formed activity was provided
      return {backgroundColor: "#000000"};
    }
}

/**
 * Returns the colour as a HEX string for the specified focus
 * for example "#FFFFFF"
 */
export function getColour(focus) {
  if(focus == "body") {
    return(bodyColour);
  }
  if(focus == "mind") {
    return(mindColour);
  }
  if(focus == "community") {
    return(communityColour);
  }
  if(focus == "food") {
    return(foodColour);
  }
  if(focus == "s5skills") {
    return(s5skillsColour);
  }
  if(focus == "green") {
    return(greenColour);
  }
  if(focus == "blue") {
    return(blueColour);
  }
  if(focus == "pink") {
    return(pinkColour);
  }
  if(focus == "orange") {
    return(orangeColour);
  }
  if(focus == "purple") {
    return(purpleColour);
  }
  if(focus == "grey") {
    return(greyColour);
  }

}

/**
 * Returns a View with the completed segments for the day, or
 * the full S5 logo if all segments are complete.
 * Requires the current day type.
 * Width (square)
 */
export function getCircleSegments(today, width) {
  //If todays data is invalid then fail
  if(!today || today.slots.length == undefined) {
    return null;
  }

  //Check each item in each slot
  let completeToday = [];
  for(let i = 0; i < today.slots.length; i++) {
    if(today.slots[i][0].complete == true) {
      //If this particular item was completed then add its "focus" to the completed lsit
      completeToday.push(today.slots[i][0].type)
    }
  }

  //Create the segment properties for each image: colour and rotation
  let currentRotation = 0.0;
  //The array of actual images
  let focusImages = [];

  for(let k = 0; k < completeToday.length; k++) {
    if(completeToday[k] == "body") {
      //focusImages.push(bodyImage);
      focusImages.push({rotation: currentRotation+"deg", tint: getColour("body")});
      //Increment the rotation by 360 / 5 degrees
      currentRotation = currentRotation + 72;
    }
    if(completeToday[k] == "mind") {
      focusImages.push({rotation: currentRotation+"deg", tint: getColour("mind")});
      currentRotation = currentRotation + 72;
    }
    if(completeToday[k] == "s5skills") {
      focusImages.push({rotation: currentRotation+"deg", tint: getColour("s5skills")});
      currentRotation = currentRotation + 72;
    }
    if(completeToday[k] == "community") {
      focusImages.push({rotation: currentRotation+"deg", tint: getColour("community")});
      currentRotation = currentRotation + 72;
    }
    if(completeToday[k] == "food") {
      focusImages.push({rotation: currentRotation+"deg", tint: getColour("food")});
      currentRotation = currentRotation + 72;
    }
    
    //Check rotation hasn't gone out of bounds
    if(currentRotation > 360) {
      currentRotation = 0;
    }
  }

  return(
    <View style={[helperStyle.segmentBox]}>
      {focusImages.length < 5 ?
        focusImages.map((imageSegment, index) => 
        <Image key={index} 
        style={[
           helperStyle.segmentImages,
          {tintColor: imageSegment.tint, transform: [{rotate: imageSegment.rotation}]},
          {width: width, height: width}
        ]} 
        source={segmentMask} />)
      :
        <Image style={[helperStyle.segmentImages, {width: width, height: width}]} source={s5Circle} />
      }
    </View>
  );
}

/**
 * Provides a view of 100% width, 1 thick, and grey in colour.
 */
export function HLine() {
  return (
    <View style={{width: "100%", height: 1, borderTopWidth: 1, borderColor: "gray"}} />
  )
}


const helperStyle = StyleSheet.create({
  segmentBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  segmentImages: {
    position: "absolute",
    resizeMode: "contain",
  }
});

/**
 * Calculates the longest streak in the month data provided.
 * A streak is defined as the number of consecutive days that
 * a user has completed all 5 activites.
 * 
 * @param {*} month 
 */
export function calculateLongestStreak(month) {
  var maxStreak = 0;
  var streakCount = 0;

  // Itterate through each day of the month and then count the longest streak.
  for(let i = 0; i < month.length; i++) {
    if(numActivitiesCompleted(month[i]) == 5) {
      //If this was a streak day then add to the counter
      streakCount++;
    } else {
      //This streak has broken, but if it was the best streak so far then record it
      if(streakCount > maxStreak) {
        maxStreak = streakCount;
      }
      streakCount = 0;
    }
  }

  return maxStreak;
}

/**
 * Calculates the streak count for a given day of the month.
 * 
 * Returns how many days in a row all 5 activities have been completed starting at 1.
 * Eg. nothing completed today = 1, all activities completed today AND yesterday = 3.
 * 
 * Requires:
 * month data (object)
 * day number (int)
 * 
 * @param {*} month
 * @param {*} day 
 */
export function streakCount(month, day) {
  var streak = 1;


  //Count back days until a non-streak day is found
  for(let i = day; i >=0; i--) {
    if(numActivitiesCompleted(month[i]) == 5) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Returns the number of activities in the day provided.
 * Requires a DAY object
 * @param {*} day 
 */
export function numActivitiesCompleted(day) {
  var numCompleted = 0;

  //check for valid data
  if(day.length > 0) {
    for(let i = 0; i < day.length; i++) {
      if(day[i][0]) {
        if(day[i][0].complete) {
          numCompleted++;
        }
      }
    }
  }

  return numCompleted;
}

/**
 * Checks the activity's focus area and converts it to a
 * human-readable string.
 * Returns "" on failure.
 * @param {*} activity 
 */
export function getFocusString(activity) {
  switch(activity.activity_focus){
    case "B":
      return "Body";
      break;
  }

  return "";
}

/**
 * Calculates the number of points for this month.
 * The current formula for points for each day is:
 * (activities completed today) x (streak count for this day)
 * @param {*} month 
 */
export function calculateMonthPoints(month) {
  var totalPoints = 0;
  //For each day add the number of activities completed ...
  //AND multiply by the streak count for that day
  for(let i = 0; i < month.length; i++) {
    totalPoints += numActivitiesCompleted(month[i]) * streakCount(month, i);
  }

  return totalPoints;
}


/**
 * Returns the calculated and stored stats for the month. Includes:
 * {points, streak, months, level}
 * 
 * @param {*} day 
 */
export async function getStats() {
  //Get the month data
  let thisMonth = await getAllActivities();

  //Calculate the longest streak this month
  const streak = calculateLongestStreak(thisMonth);

  //Calculate points this month
  const points = calculateMonthPoints(thisMonth);

  //Program days divided by program length (always 28 days)
  const dayOfProgram = await getDaysSinceProgramStart();
  const lengthOfProgram = await getLengthOfProgram();
  //program length has to fail safely otherwise animations all break and causes crash
  let progress = 0;
  lengthOfProgram ? progress = dayOfProgram / lengthOfProgram : progress = 0;

  //Dummy data
  return {points, streak, months: 1, level: "Rookie", progress};
}

/**
 * Checks if any rest days are recorded and returns them
 */
export async function getRestDays() {
  //Check if a survey was completed
        //If the user has completed the survey then check their rest days
  const surveyResponse = await getSurveyResponse();

  console.log("survey response found:", surveyResponse);
  //Find question ID 3 in the result
  if(surveyResponse) {
      for(let i = 0; i < surveyResponse.length; i++) {
          if(surveyResponse[i].question_id == 6) {
            console.log("Rest Days:", surveyResponse[i].answers);

            //Feature has been temporarily disabled
            //Also note that this question was removed from the survey and the references are out of date
            return null;
            return surveyResponse[i].answers;
          }
      }
    return null;
  } 

  return null;
}

/**
 * Calculates the time (in months) since the user signed up, and
 * also the human-readable months and year that the user signed up
 * 
 * Returns {}
 */
export async function getMonthsSinceSignup() {
  const userData = await getUserData();
  const currentDate = Date.now();

  //Check valid data
  if(!userData) {
    return null;
  }
  if(!userData.user_credential) {
    return null;
  }
  if(!userData.user_credential.user_created) {
    return null;
  }


  const signupDate = new Date(userData.user_credential.user_created.date.substr(0, 10));
  
  //Calculate the difference
  const numberOfMonths = Math.ceil((currentDate - signupDate.getTime()) / (3600 * 24 * 28 * 1000));

  //Generate a nice string of when the user signed up
  const memberSince = monthStrings[signupDate.getMonth()] + " " + signupDate.getFullYear().toString();

  return {numberOfMonths, memberSince};
}

/**
 * Returns the user's subscription level as an integer.
 * 
 * Level numbers are defined elsewhere.
 */
export async function isUserPro() {
  const userData = await getUserData();

  if(!userData) {
    return null;
  }
  if(!userData.user_credential) {
    return null;
  }
  if(!userData.user_credential.subscription) {
    return null;
  }
  if(!userData.user_credential.subscription.details) {
    return null;
  }

  if(userData.user_credential.subscription.details.subscription_level >= proSubscription) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks the user's subscription level and returns TRUE if they are a developer.
 */
export async function isUserDeveloper() {
  const userData = await getUserData();

  if(!userData) {
    return null;
  }
  if(!userData.user_credential) {
    return null;
  }
  if(!userData.user_credential.subscription) {
    return null;
  }
  if(!userData.user_credential.subscription.details) {
    return null;
  }

  if(userData.user_credential.subscription.details.subscription_level == developerSubscription) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks the user's subscription data and determins if they have a valid subscription
 */
export async function isUserSubscribed() {
  const userData = await getUserData();

  if(!userData) {
    return null;
  }
  if(!userData.user_credential) {
    return null;
  }
  if(!userData.user_credential.subscription) {
    return null;
  }
  if(!userData.user_credential.subscription.details) {
    return false;
  }

  if(userData.user_credential.subscription.subscribed) {
    return true;
  } else {
    return false;
  }
}