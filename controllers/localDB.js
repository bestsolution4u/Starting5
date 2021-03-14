/**
 * Abstraction layer for managing local storage.
 * 
 * Currently uses AsyncStorage. from react-native-community which is deprecated.
 * TODO: migrate to newer version of async storage
 */

import AsyncStorage from '@react-native-community/async-storage';

import { setSavedRemoteActivity, deleteSavedRemoteActivity } from "./remoteDB";

//Storage Keys
const program_key = "program_key";
const program_day_key = "program_day_";
const user_key = "user";
const saved_activities_key = "saved_activities";
const toolkit_key = "toolkit_key";
const liked_activities_key = "liked_activities";
const data_key = "data_";
const survey_key = "survey_key";
const activity_key = "activity_";

/**
 * Returns the current date in a standardised format
 * "YYYY-MM-DD" where days and months DO HAVE preceeding zeros, 
 * days and months indexed starting at 1
 */
export function getCurrentDate() {
  const currentDate = new Date();
  let thisYear = (currentDate.getFullYear()).toString();
  let thisMonth = (currentDate.getMonth() + 1).toString();
  let thisDay = (currentDate.getDate()).toString();

  //Check for and add preceeding zeros to months and days
  thisMonth.length < 2 ? thisMonth = "0" + thisMonth : null;
  thisDay.length < 2 ? thisDay = "0" + thisDay : null;

  let thisDate = thisYear + "-" + thisMonth + "-" + thisDay;
  return thisDate;
}

/**
 * Clears ALL local data stored for the app
 */
export async function clearAllAppData() {
  //First get ALL of the AsyncStorage keys associated with this app
  let all_keys = [];
  try {
    all_keys = await AsyncStorage.getAllKeys();
  } catch(e) {
    console.log("get all keys error:", e);
  }

  console.log("All Keys To Be Cleared:", all_keys);

  //Multi-remove all of the storage keys
  try {
    await AsyncStorage.multiRemove(all_keys);
    console.log("All Data Cleared");

    return true;
  } catch(e) {
    console.log("error removing:", e);

    return false;
  }
}


/**
 * Returns ALL the app data associate with this app
 */
export async function getAllAppData() {
  //First get ALL of the AsyncStorage keys associated with this app
  let all_keys = [];
  try {
    all_keys = await AsyncStorage.getAllKeys();
  } catch(e) {
    console.log("get all keys error:", e);
  }

  console.log("Number of keys for this app:", all_keys.length, "keys:", all_keys);

  //Multi-remove all of the storage keys
  try {
    let allData = await AsyncStorage.multiGet(all_keys);

    return JSON.parse(allData);
  } catch(e) {
    console.log("error retrieving:", e);

    return false;
  }
}

/**
 * Returns the current program
 */
async function getProgram() {
  //Get the program data
  try {
    //First get the reference to the program
    const rawProgramStructure = await AsyncStorage.getItem(program_key);
    const programStructure = JSON.parse(rawProgramStructure)
    //Check programStructure isn't empty
    if(!programStructure) {
      throw "Emtpy program."
    }
    //If no keys exist then throw an error
    if(!programStructure.program) {
      throw "Corrupt program data."
    }

    return programStructure.program;

  } catch (e) {
    console.log("Error retreiving program: " + e);

    return null;
  }
}

/**
 * Saves a program, replacing the current program in storage.
 * @param {*} newProgram 
 */
export async function saveProgram(newProgram) {

  //Save the activity data to storage
  await saveActivities(newProgram.activity_data);

  //Get the program start date
  let keys = Object.keys(newProgram.program);
  newProgram.start_date = newProgram.program[keys[0]][0][0].survey_response_program_start_date.date.substring(0, 10);

  //Create a reference to the new program
  let programReference = {start_date: newProgram.start_date, program: newProgram.program};

  //Save the provided program
  try {
    await AsyncStorage.setItem(program_key, JSON.stringify(programReference));
    return true;
  } catch (e) {
    console.log("Error Saving Program: " + e);
    return false;
  }
}

/**
 * Saves the provided activities to AsyncStorage.
 * Requires: an array of ativities
 * activity_key_[activity_id]
 * 
 * @param [{*}] [activity]
 */
async function saveActivities(activity) {
  if(!activity) {
    return null;
  }
  if(activity.length < 1) {
    return null
  }

  //Build an array to save with multiSet
  //Get the activites keys
  let keys = Object.keys(activity);
  let items = [];
  for(let i = 0; i < keys.length; i++) {
    items.push([activity_key + activity[keys[i]].activity_id, JSON.stringify(activity[keys[i]])])
  }

  //Save the provided program
  try {
    await AsyncStorage.multiSet(items);

    return true;
  } catch (e) {
    console.log("Error Saving Activity: " + e);
    return false;
  }
}

/**
 * Get an activity from local storage by activity_id
 * @param {*} id 
 */
export async function getActivity(id) {
  try {
    const jsonValue = await AsyncStorage.getItem(activity_key + id);
    return JSON.parse(jsonValue);
  } catch(e) {
    console.log("Read Activity Error: " + e);
    return null;
  }
}

/**
 * Returns the starting date of the program.
 */
export async function getProgramStartDate() {
  //Get the program data
  try {
    const data = await AsyncStorage.getItem(program_key);
    const program = data ? JSON.parse(data) : null;

    if(program.start_date) {
      return program.start_date;
    } else {
      return null;
    }

  } catch (e) {
    console.log("Read Program Start Date Error: " + e);

    return null;
  }
}

export async function getDaysSinceProgramStart() {
  const now = Date.now();
  const programStartDate = await getProgramStartDate();
  console.log("program start date:", programStartDate);
  let formatDate = "0000-00-00";
  try {
    formatDate = programStartDate.split("-");
  } catch {
    return null;
  }
  //Convert the dates to JS DATE types
  if(formatDate.length > 0) {
    const programStartTime = new Date(formatDate[0], formatDate[1] - 1, formatDate[2]);
    const difference = Math.abs(now - programStartTime.getTime());

    return Math.ceil(difference / (1000 * 3600 * 24));
  } else {
    return null;
  }
}

/**
 * Just returns the length of the program structure.
 * Doesn't actually calculate the time from start to
 * finish by date.
 */
export async function getLengthOfProgram() {
  let program = await getProgram();
  let days = Object.keys(program);
  return days.length;
}

/**
 * Takes an array of activity objects from the program object and replaces
 * each activity reference with the associated activity data.
 * Array should be of the form:
 * [ [ activity_id ], ... ]
 * @param [] day 
 */
async function getActivitiesByRef(thisSlot) {
  //Check data is valid
  if(thisSlot.length < 1) {
    return null;
  }

  let newSlotKeys = [];
  for(let j = 0; j < thisSlot.length; j++) {
    //Build an array of keys to multi-get items for this slot
    newSlotKeys.push(activity_key + thisSlot[j].activity_id);
  }
  
  let rawSlot = await AsyncStorage.multiGet(newSlotKeys);
  let newSlot = [];
  for(let j = 0; j < rawSlot.length; j++) {
    newSlot.push(JSON.parse(rawSlot[j][1]));
  }

  return newSlot;
}

/**
 * Return the activities for the whole month program.
 */
export async function getAllActivities() {
  //Get the full program
  let program = await getProgram();
  
  //Check if data is valid and fail
  if(program == null) {
    return false;
  }
  if(program == undefined) {
    return false;
  }

  //Convert to a flat array for easy mapping
  const days = Object.keys(program);
  let flatProgram = [];
  for(let i = 0; i < days.length; i++) {
    //Check which activities are complete this day
    //Now that we have found the day, we need to determine which activities are complete.
    const dateToFetch = await programDayToDate(days[i]);
    const dayData = await getDayUserData(dateToFetch);
    
    //Generate a program with full activity data based on references
    let thisDay = program[days[i]];
    let dayProgram = [];

    //Each activity needs to know which day of the program it belongs to
    for(let j = 0; j < thisDay.length; j++) {
      //Get the actual activity data
      let thisSlot = await getActivitiesByRef(thisDay[j]);

      for(let k = 0; k < thisSlot.length; k++) {
        thisSlot[k].day_of_program = days[i];
      }

      //Add the slot to the new day
      dayProgram.push(thisSlot);
    }

    //Add the "complete" flag to any completed activities for reference later
    if(dayData.completed_activities) {

      for(let j = 0; j < dayData.completed_activities.length; j++) {
        //replace the program with just the completed activity
        dayProgram[dayData.completed_activities[j].slot][dayData.completed_activities[j].index].complete = true;
        dayProgram[dayData.completed_activities[j].slot] = [dayProgram[dayData.completed_activities[j].slot][dayData.completed_activities[j].index]];
      }
    }

    flatProgram.push(dayProgram);
  }

  //Return the program array
  return flatProgram;
}

/**
 * returns just the data for a specific day
 * 
 * @param int day
 */
export async function getDayActivities(day) {
  //Get the current program
  let program = await getProgram();

  //Check if data is valid and fail
  if(program == null) {
    return false;
  }
  if(program == undefined) {
    return false;
  }
  if(day > program.length) {
    return false;
  }
  if(program[day.toString()]) {
    //Now that we have found the day, we need to determine which activities are complete.
    const dateToFetch = await programDayToDate(day);
    const dayData = await getDayUserData(dateToFetch);

    //Get activities associated with this day
    let thisDay = program[day.toString()]
    let dayProgram = [];

    //Each activity needs to know which day of the program it belongs to
    for(let j = 0; j < thisDay.length; j++) {
      let thisSlot = await getActivitiesByRef(thisDay[j]);

      for(let k = 0; k < thisSlot.length; k++) {
        thisSlot[k].day_of_program = day;
      }

      //Add the slot to the new program array
      dayProgram.push(thisSlot);
    }

    if(dayData.completed_activities) {

      for(let i = 0; i < dayData.completed_activities.length; i++) {
        //replace the program with just the completed activity
        dayProgram[dayData.completed_activities[i].slot][dayData.completed_activities[i].index].complete = true;
        dayProgram[dayData.completed_activities[i].slot] = [dayProgram[dayData.completed_activities[i].slot][dayData.completed_activities[i].index]];
      }
    }

    //Have to add a "day" element to the object
    return dayProgram;
  }

  return false;
}

/**
 * Converts a the day_of_program to the real-world date
 */
export async function programDayToDate(programDay) {
  //Get program start date
  let programStart = await getProgramStartDate();
  let programStartArray = programStart.split("-");

  let programStartDate = new Date(programStartArray[0], programStartArray[1] - 1, programStartArray[2]);
  let timeToAdd = ((programDay - 1) * 24 * 60 * 60 * 1000);
  let newDate = programStartDate.getTime() + timeToAdd;

  let dateObj = new Date(newDate);
  let thisMonth = (dateObj.getMonth() + 1).toString();
  let thisDay = (dateObj.getDate()).toString();

  
  //Add any leading zeros as required
  thisMonth.length < 2 ? thisMonth = "0" + thisMonth : null;
  thisDay.length < 2 ? thisDay = "0" + thisDay : null;
  

  let dateString = dateObj.getFullYear().toString() + "-" + thisMonth + "-" + thisDay;

  return dateString;
}

/**
 * Converts a date in the form YYYY-MM-DD to the
 * day_of_program of the current program.
 * @param String date 
 */
export async function dateToProgramDay(date) {
  //Convert program start date to date object
  let programStart = await getProgramStartDate();
  let programStartArray = programStart.split("-");
  let programStartDate = new Date(Number(programStartArray[0]), Number(programStartArray[1]) - 1, Number(programStartArray[2]) + 1);

  //Convert provided date to date object
  let thisDateArray = date.split("-");
  let thisDate = new Date(Number(thisDateArray[0]), Number(thisDateArray[1]) - 1, Number(thisDateArray[2]) + 1);

  let difference = ((thisDate.getTime() - programStartDate.getTime()) / (24 * 3600 * 1000)) + 1;

  return difference;
}

/**
 * Saves user credentials provided by the server with a token to later access data.
 * @param {*} userCreds
 */
export async function saveCreds(userCreds) {
  //check data exist
  if(!userCreds) {
    return false;
  }

  //Add a flag to confirm is logged in
  userCreds.isLoggedIn = true;
  
  try {
    const loggedIn = JSON.stringify(userCreds);

    await AsyncStorage.setItem(user_key, loggedIn);
    return true;
  } catch (e) {
    console.log("Save Error: " + e);
    return false;
  }
}

/**
 * Clears the local "user" data (that is the user login details, not the saved data)
 */
export async function doLogOut() {
  // Just clears all app data
  clearAllAppData();
}

/**
 * Returns the saved user credentials, or NULL if there is an error or nothing is saved.
 */
export async function getUserData() {

  try {
    const jsonValue = await AsyncStorage.getItem(user_key);
    console.log("get user data:", jsonValue);
    return JSON.parse(jsonValue);
  } catch(e) {
    console.log("Read Error: " + e);
    return null;
  }
}

/**
 * Marks an activity as complete in the daily data store.
 * 
 * @param int day - day of program
 * @param {slot, index, id} activityRef
 */
export async function completeActivity(day, activityRef) {
  let date = await programDayToDate(day);
  let thisDay = await getDayUserData(date);

  
  if(thisDay.completed_activities) {
    thisDay.completed_activities.push(activityRef);
  } else {
    thisDay.completed_activities = [activityRef]
  }

  console.log("saving day:", date, " activity:", thisDay);
  
  let result = await saveDayUserData(date, thisDay);

  return result;
}

/**
 * Returns an array of references to each completed activity today (activityRef)
 * @param int day 
 */
export async function getCompletedActivities(day) {
  const dateOfDay = await programDayToDate(day);
  const dayData = await getDayUserData(dateOfDay);

  if(dayData.completed_activities) {
    return dayData.completed_activities;
  } else {
    return null;
  }
}

/**
 * Returns TRUE if the specific activity reference is complete,
 * otherwise returns FALSE.
 * @param int day 
 * @param {slot, index} activityRef 
 */
export async function isActivityComplete(day, activityRef) {
  const dateOfDay = await programDayToDate(day);
  const dayData = await getDayUserData(dateOfDay);

  if(dayData.completed_activities) {
    console.log("completed activities:", dayData.completed_activities);
    for(let i = 0; i < dayData.completed_activities.length; i++) {
      if(dayData.completed_activities[i].slot == activityRef.slot) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns an array of all completed slots on the given day.
 * 
 * @param int day 
 */
export async function getAllCompletedSlots(day) {
  const dateOfDay = await programDayToDate(day);
  const dayData = await getDayUserData(dateOfDay);

  let completeSlots = [false, false, false, false, false];

  if(dayData.completed_activities) {
    console.log("all completed activities:", dayData.completed_activities);
    for(let i = 0; i < 5; i++) {
      for(let j = 0; j < dayData.completed_activities.length; j++) {
        if(dayData.completed_activities[j].slot == i) {
          completeSlots[i] = true;
        }
      }
    }
  }

  return completeSlots;
}

/**
 * Saves an array of activity references to the saved activities.
 * Called at login to add data to an empty list
 * 
 * NOTE:
 * This clears any previously saved items in the list.
 * 
 * @param [{*}] activities 
 */
export async function setSavedActivities(activities) {

  //Check that the data is at leasts kind of valid
  if(!activities) {
    return null;
  }
  if(activities.length < 1) {
    return null;
  }
  if(!activities[0].activity_id) {
    return null;
  }

  try {
    const newSave = JSON.stringify(activities);

    await AsyncStorage.setItem(saved_activities_key, newSave);
  } catch (e) {
    console.log("Save Save Error: " + e);
    return null;
  }
}

/**
 * Saves the provided activity object to the saved activity list.
 * 
 * @param {*} activity 
 */
export async function setSavedActivity(activity) {
  /**
   * Get all the saved activities, append the new activity, and then save
   * the new array back.
   */

  //Get all activities
  var savedActivities = await getSavedActivities();

  //If data is invalid, then make it a new array
  if(savedActivities == "" || savedActivities == null) {
    savedActivities = new Array();
  }

  //Check that the new activity isn't already saved. This should never occur.
  for(let i = 0; i < savedActivities.length; i++) {
    if(activity.activity_id == savedActivities[i].activity_id) {
      //If the provided activity is already saved then don't save again.
      console.log("saving activity: duplicate activity ID:", activity.activity_id);
      return false;
    }
  }


  let newActivity = {activity_id: activity.activity_id};
  
  savedActivities.push(newActivity);

  //Push the saved activity to the remote server in the background, no need to wait
  setSavedRemoteActivity(newActivity).then((result) => console.log("save remote activity:", result));

  try {
    const newSave = JSON.stringify(savedActivities);

    await AsyncStorage.setItem(saved_activities_key, newSave);
  } catch (e) {
    console.log("Save Save Error: " + e);
    return null;
  }
}

/**
 * Removes an activity with the given ID from the saved activity store.
 */
export async function deleteSavedActivity(activity) {

  //Get all activities
  var savedActivities = await getSavedActivities();

  //If data is invalid, then make it a new array
  if(savedActivities == "" || savedActivities == null) {
    savedActivities = new Array();
  }

  //Check each item and build a new list of saved activites MINUS the gien ID
  var newSave = [];
  for(let i = 0; i < savedActivities.length; i++) {
    if(activity.activity_id != savedActivities[i].activity_id) {
      newSave.push(savedActivities[i]);
    }
  }

  //Delete the activity from the remote server -- Do this silently, no need to wait
  deleteSavedRemoteActivity(activity);

  try {
    await AsyncStorage.setItem(saved_activities_key, JSON.stringify(newSave));
  } catch (e) {
    console.log("Delete Saved Error: " + e);
    return null;
  }
}

/**
 * Clears all of the user's saved activities
 */
export async function clearAllSavedActivities() {
  try {
    const newSave = JSON.stringify("");

    await AsyncStorage.setItem(saved_activities_key, newSave);
  } catch (e) {
    console.log("Clear Saves Error: " + e);
  }
}

/**
 * Gets an array of activities saved by the user.
 * Returns an array of full activity data.
 */
export async function getSavedActivities() {
  let savedActivitiesRef = [];
  try {
    const jsonValue = await AsyncStorage.getItem(saved_activities_key);
    savedActivitiesRef = JSON.parse(jsonValue);
  } catch(e) {
    console.log("Read Saves Error: " + e);
    return null;
  }

  //If there is no previous data then return dummy data.
  if(!savedActivitiesRef) {
    return [];
  }

  if(savedActivitiesRef.length < 1) {
    return null;
  }

  //Get the actual activity data
  let savedActivities = await getActivitiesByRef(savedActivitiesRef);

  return savedActivities;
}

/**
 * Checks if an activity is in the user's saved activity list.
 * Rquires: an activity object
 * returns: true / false
 * 
 * @param {*} activity 
 */
export async function isActivitySaved(activity) {
  let savedActivities = await getSavedActivities();

  //If data is invalid, then make it a new array
  if(savedActivities == "" || savedActivities == null) {
    savedActivities = new Array();
  }

  //Check if the ID of each item matches
  for(let i = 0; i < savedActivities.length; i++) {
    if(savedActivities[i].activity_id == activity.activity_id) {
      console.log("activty found ID:", activity.activity_id);
      return true;
    }
  }

  return false;
}

/**
 * Add OR remove a specific activity ID to the "liked activities" list.
 * 
 * If an activity ID already exists in the list, then it is removed.
 * 
 * @param {*} activity 
 */
export async function likeActivity(activity) {
  //Get previously liked activities and check for duplicates
  let likedActivities = await getLikedActivities();

  //Check if data is valid
  if(likedActivities){
    //Check for duplicates
    let foundDuplicate = false;
    for(let i = 0; i < likedActivities.length; i++) {

      if(likedActivities[i] == activity.activity_id) {
        //If he activity already existst then remove it (unlike)
        likedActivities.splice(i, 1);
        foundDuplicate = true;
        console.log("unliked activity:", activity.activity_id);
      }

    }
    if(!foundDuplicate) {
      //Add the new activity to the list
      likedActivities.push(activity.activity_id);
    }

  } else {
    likedActivities = [activity.activity_id];
  }

  //Save the new like by adding it to the old one
  try {
    const newSave = JSON.stringify(likedActivities);

    await AsyncStorage.setItem(liked_activities_key, newSave);
  } catch (e) {
    console.log("Save Likes Error: " + e);
    return null;
  }

}

/**
 * Returns an array of liked activities represented as activity_ids.
 */
export async function getLikedActivities() {
  try {
    const jsonValue = await AsyncStorage.getItem(liked_activities_key);
    console.log("liked activities:", JSON.parse(jsonValue));
    return JSON.parse(jsonValue);
  } catch(e) {
    console.log("Read Likes Error: " + e);
    return null;
  }
}

/**
 * Returns true if the provided activity is liked
 */
export async function isActivityLiked(activity) {
  const likedActivities = await getLikedActivities();

  //Check if any of the liked activities match
  if(likedActivities) {
    for(let i = 0; i < likedActivities.length; i++) {
      if(likedActivities[i] == activity.activity_id) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Saves usage stats to the usage statistics entry.
 * 
 * NOTE: this is a direct save, it will overwrite any old data.
 */
export async function saveUsageStats(newStats) {
  let currentDate = getCurrentDate();

  let thisDay = await getDayUserData(currentDate);

  //If a mood already exists then add a new one, otherwise make a new array
  if(thisDay.usage_stats) {
    thisDay.usage_stats.push(newStats);
  } else {
    thisDay.usage_stats = [newStats]
  }
  
  let result = await saveDayUserData(getCurrentDate(), thisDay);


  return result;
}

/**
 * Get usage stats from the database.
 * 
 */
export async function getUsageStats() {
  let currentDate = getCurrentDate();
  const dayData = await getDayUserData(currentDate);

  return dayData.usage_stats;
}

/**
 * Saves an array of activities to the toolkit list
 * 
 * @param [{*}] activity 
 */
export async function saveToolkitActivities(activities) {

  try {
    const newSave = JSON.stringify(activities);

    await AsyncStorage.setItem(toolkit_key, newSave);
  } catch (e) {
    console.log("Save Toolkit Error: " + e);
    return null;
  }
}

/**
 * Returns the available toolkit acitivites for this user
 */
export async function getToolkitActivities() {
  //Get references to the toolkit activity_id
  let toolkitActivityRefs = [];
  try {
    const jsonValue = await AsyncStorage.getItem(toolkit_key);
    toolkitActivityRefs = JSON.parse(jsonValue);
  } catch(e) {
    console.log("No toolkit items");
    return null;
  }

  if(toolkitActivityRefs.length < 1) {
    return null;
  }

  //Get the actual activity data
  let toolkitActivities = await getActivitiesByRef(toolkitActivityRefs);

  return toolkitActivities;
}

/**
 * Records the user's current mood.
 * 
 * Accepts a mood object = {energy: int, mood int, motivation: int}
 * Objects are recorded as an array of moods of the form:
 * [{date: YYYY-MM-DD, time: hh:mm, mood: {mood}}]
 * 
 * @param {*} mood 
 */
export async function saveMood(mood) {
  //Get current date and time
  const thisDate = getCurrentDate();

  //Get the previous moods and add this new one
  let thisDay = await getDayUserData(thisDate);

  //If a mood already exists then add a new one, otherwise make a new array
  if(thisDay.mood) {
    thisDay.mood.push(mood);
  } else {
    thisDay.mood = [mood]
  }
  
  let result = await saveDayUserData(thisDate, thisDay);

  return result;
}

/**
 * Returns an array of all moods recorded during this program.
 */
export async function getMoods() {
    //Get user data for whole program
  let monthData = await getUserDataForProgram();
  
  //Make a flat array of moods for the month
  let moods = [];
  for(let i = 0; i < monthData.length; i++) {
    if(monthData[i].mood) {
      if(monthData[i].mood.length > 0) {
        for(let j = 0; j < monthData[i].mood.length; j++) {
          moods.push(monthData[i].mood[j]);
        }
      }
    }
  }

  return moods;
}

/**
 * Returns the moods recorded only for today. Good for counting.
 */
export async function getTodayMoods() {
  const dayData = await getDayUserData(getCurrentDate());

  if(dayData.mood) {
    return dayData.mood;
  } else {
    return null;
  }
}

/**
 * Saves some journal entries in to todays daily data
 * 
 * @param {*} newJournal
 */
export async function saveJournal(newJournal) {
  //Get current date and time
  const thisDate = getCurrentDate();

  //Get the previous days data
  let thisDay = await getDayUserData(thisDate);

  //If a journal already exists then add a new one, otherwise make a new array
  if(thisDay.journal) {
    thisDay.journal.push(newJournal);
  } else {
    thisDay.journal = [newJournal]
  }
  
  let result = await saveDayUserData(thisDate, thisDay);

  return result;
}

/**
 * Gets the user data recorded just during this program.
 * Returns an array starting at the first day of the program,
 * up to now
 */
export async function getUserDataForProgram() {
  //Get current day of program, and count up to now
  const programDay = await getDaysSinceProgramStart();

  let programData = [];
  for(let i = 1; i <= programDay; i++) {
    let dateOfDay = await programDayToDate(i);
    let dayData = await getDayUserData(dateOfDay);
    programData.push(dayData);
  }

  return programData;
}

/**
 * Returns the stored data for today only
 * @param String date "YYYY-MM-DD"
 */
export async function getDayUserData(date) {
  const key = data_key + date;

  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const dayData = JSON.parse(jsonValue);

    if(dayData) {
      //If a valid day is found, then return it
      return dayData;
    } else {
      return {mood: [], completed_activities: [], usage_stats: []};
    }
  } catch(e) {
    console.log("Read User Data Error: " + e);
    return null;
  }
}

/**
 * Saves the provided object to the given day's data set
 * 
 * @param String date "YYYY-MM-DD"
 * @param {*} item 
 */
export async function saveDayUserData(date, newDay) {
  //Get the current day and append new data
  const key = data_key + date;

  //Add the date stamp to the object
  let newData = newDay;
  newData.date = date;

  try {
    const newSave = JSON.stringify(newData);

    await AsyncStorage.setItem(key, newSave);
    return true;
  } catch (e) {
    console.log("Save Day User Data Error: " + e);
    return null;
  }
}

/**
 * Saves the survey response data.
 * @param [{*}] surveyResponse 
 */
export async function saveSurveyResponse(surveyResponse) {
  try {
    const newSave = JSON.stringify(surveyResponse);

    await AsyncStorage.setItem(survey_key, newSave);
  } catch (e) {
    console.log("Save Survey Error: " + e);
    return null;
  }
}

/**
 * Returns the user's survey response data, if any.
 * NULL if no data found.
 */
export async function getSurveyResponse() {
  try {
    const jsonValue = await AsyncStorage.getItem(survey_key);
    const surveyData = JSON.parse(jsonValue);

    return surveyData;
    
  } catch(e) {
    console.log("Read Survey Error: " + e);
    return null;
  }
}