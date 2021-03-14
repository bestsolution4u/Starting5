/**
 * Database layer for communicating with the remote API.
 * 
 * Unlike the rest of the app this exports individual functions and which return the requested data.
 */

import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';

import { getUserData, getCurrentDate, programDayToDate, getDaysSinceProgramStart, saveDayUserData } from "./localDB";

//Styles
import appStyle from "../styles/appStyle.js";

//Constants
const url = "https://piblicapi.azurewebsites.net/index.php"; //Production URL
//const url = "https://s5api.azurewebsites.net/index.php"; //Testing URL
const deviceID = "testdevice";
const azureURIPrefix = "https://starting5cdn.azureedge.net/media/";


async function sendRequest(body) {
    try {
        //Set up the fetch request
        let response = await fetch(url, {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        //Get the response
        let result = await response.json();

        return result
    } catch (error) {
        //So this failed pretty bad. Run the request again and get the full text response
        let result = "";
        try {
            //Set up the fetch request
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            //Get the response
            result = await response.text();
        } catch { result = "Unable to parse TEXT response." }

        console.log("SERVER REQUEST ERROR! Request:", body, "Response:", result, "Error:", error);
        return "Network Error";
    }
}

export async function firebaseLogin(credentials) {
    let request = {
        request: true, 
        user_login: {
            user_device: deviceID,
            firebase: credentials}
    }

    console.log("Firebase Login Request:", request);

    let response = await sendRequest(request);

    return response;
}

/**
 * Checks the user's login status using the saved credentials
 * and login token.
 * 
 * @param {*} credentials 
 */
export async function checkLogin() {
    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return false;
    }

    //Received vaid data, now request the program
    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {cred_only: true}
        }

        let response = await sendRequest(request);

        return response;
    } else {
        return false;
    }
}

/**
 * Creates a new user. Currently hard-coded dummy data
 * 
 * @param {*} credentials 
 */
export async function createUser(credentials) {
    let request = {
        request: true, 
        user_create: {
            user_device: deviceID,
            user_email: credentials.user_email,
            user_password: credentials.user_password,
            user_first: credentials.first_name,
            user_last: credentials.last_name,
        }
    }

    let response = await sendRequest(request);

    return response;
}

/**
 * Gets the program for this user
 */
export async function getRemoteProgram(credentials) {
    let date = getCurrentDate();
    //Received vaid data, now request the program
    if(credentials.user_credential) {
        console.log("user creds:", credentials.user_credential);

        let request = {
            user_cred: {user_id: credentials.user_credential.user_id,
                user_device: deviceID,
                user_hash: credentials.user_credential.user_hash},
            request: {program_v2: {date: date}},
        }

        let response = await sendRequest(request);

        return response;
    } else {
        return null;
    }
}

/**
 * Submits a survey response and expects to receive a program in return
 * @param {*} credentials 
 */
export async function setSurveyResponse(credentials) {
    let dummyData = {
        survey_response_program_start_date: getCurrentDate(),
        survey_response_program_code: "",
        survey_response_survey_completed_id: 1,
        buckets: [
            {
                bucket_focus: "B",
                bucket_plan_level: "1"
            },
            {
                bucket_focus: "M",
                bucket_plan_level: "M1"
            },
            {
                bucket_focus: "S",
                bucket_plan_level: "S1"
            }
        ]
    };

    //Received vaid data, now request the program
    if(credentials.user_credential) {
        console.log("user creds:", credentials.user_credential);

        let request = {
            user_cred: {user_id: credentials.user_credential.user_id,
                user_device: deviceID,
                user_hash: credentials.user_credential.user_hash},
            request: {complete_survey: { data: JSON.stringify(dummyData) } }
        }

        let response = await sendRequest(request);

        return response;
    } else {
        return null;
    }
}

export async function getURIPrefix() {
    return azureURIPrefix;
}

/**
 * Request a specific activity from the server.
 * @param int activity_id 
 */
export async function getActivityByID(activity_id) {
    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {get_activity: {activity_id: activity_id}},
        }

        let response = await sendRequest(request);

        if(response.get_activity) {
            return response.get_activity;
        } else {
            return false;
        }
    } else {
        return null;
    }
}

/**
 * Records a new saved activity.
 * 
 * @param {*} activity 
 */
export async function setSavedRemoteActivity(activity) {
    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {set_save: {activity_id: activity.activity_id}},
        }

        let response = await sendRequest(request);
        return response;
    } else {
        return null;
    }
}

/**
 * Gets all saved activities for the user
 * 
 */
export async function getSavedRemoteActivities() {
    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {get_save: true}
        }

        let response = await sendRequest(request);
        return response;
    } else {
        return null;
    }
}

/**
 * Deletes the specified saved activity from the remote server.
 * 
 * @param activity
 */
export async function deleteSavedRemoteActivity(activity) {
    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {delete_save: {activity_id: activity.activity_id}},
        }

        let response = await sendRequest(request);
        return response;
    } else {
        return null;
    }
}

/**
 * Sends the daily usage data through to the server for archiving.
 * @param string date YYYY-MM-DD
 * @param {*} data 
 */
export async function saveRemoteDayUserData(date, data) {
    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {set_day: {date, data}},
        }

        console.log("save request:", request);

        let response = await sendRequest(request);
        return response;
    } else {
        return null;
    }
}

/**
 * Requests any saved data for each day of the program,
 * up until today.
 * 
 * @param string date YYYY-MM-DD
 */
export async function getRemoteProgramUserData() {
    //Get the program start date and calculate each date up to today
    let daysSinceProgramStart = await getDaysSinceProgramStart();
    let daysToFetch = [];
    for(let i = 1; i <= daysSinceProgramStart; i++) {
        daysToFetch.push(await programDayToDate(i));
    }

    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    //For each day in the array, add a new section to the request.
    let savedData = [];
    if(userCreds.user_credential) {
        for(let i = 0; i < daysToFetch.length; i++) {
            let request = {
                user_cred: {user_id: userCreds.user_credential.user_id,
                    user_device: deviceID,
                    user_hash: userCreds.user_credential.user_hash},
                request: {get_day: {date: daysToFetch[i]}},
            }

            let response = await sendRequest(request);

            if(response.get_day.data) {
                saveDayUserData(daysToFetch[i], JSON.parse(response.get_day.data));
                savedData.push({date: daysToFetch[i], data: JSON.parse(response.get_day.data)})
            }
        }
        return savedData;
    } else {
        return null;
    }
}

/**
 * Requests stored user data from a specific day from the server.
 * @param string date YYYY-MM-DD
 */
export async function getRemoteDayUserData(date) {

    //Get user credentials, fail if they don't exist
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {set_day: {date}},
        }

        let response = await sendRequest(request);
        return response;
    } else {
        return null;
    }
}

/**
 * Fetches the toolkit items from the server.
 */
export async function getRemoteToolkitActivities() {
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    const date = getCurrentDate();

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {therapy_room: {date}},
        }

        let response = await sendRequest(request);
        return response;
    } else {
        return null;
    }
}

/**
 * Sends feedback to the server to be reported back to the admins.
 * @param {*} feedback 
 */
export async function sendRemoteFeedback(feedback) {
    const userCreds = await getUserData();
    if(!userCreds) {
        return null;
    }

    if(userCreds.user_credential) {
        let request = {
            user_cred: {user_id: userCreds.user_credential.user_id,
                user_device: deviceID,
                user_hash: userCreds.user_credential.user_hash},
            request: {feedback: feedback}
        }

        console.log("feedback request:", JSON.stringify(request));

        let response = await sendRequest(request);
        return response;
    } else {
        return null;
    }
}