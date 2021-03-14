
import React from 'react';
import { View, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import { firebase } from '@react-native-firebase/app';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import { firebaseLogin, getRemoteProgram, getRemoteProgramUserData, 
    getRemoteToolkitActivities } from "../controllers/remoteDB";

import { saveCreds, saveProgram, saveToolkitActivities, setSavedActivities } from "../controllers/localDB";

GoogleSignin.configure({
    webClientId: '939224244905-d3q2svjqil8bvnaftrfq19u4obohkkle.apps.googleusercontent.com',
});

/**
 * Performs email signup with Firebase
 * Adds an extra "displayName" detail.
 * Requires:
 * isLoading - function to changing loading sate
 * emaill - email address
 * password
 * firstName
 * lastName
 */
export async function onEmailSignupPress(isLoading, email, password, firstName, lastName) {
    //Report is loading in progreess
    isLoading(true);

    //A running error
    let error="";

    //Create a new Firebase user
    const userData = await firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((thisError) => {console.log("Error creating Firebase account:", thisError);
            error = thisError;
    });

    //If creating a user failed then fail
    if(!userData) {
        return {error_desc: error};
    }

    await userData.user.updateProfile({
      displayName: firstName + " " + lastName,
      photoURL: ''
    });
  
    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
  
    
    const response = await firebaseLogin(idTokenResult).catch((error) => {
      console.log(error.code, "Error creating Firebase user:", error.message);
      return null;
    });
  
    return response;
}

/**
 * Perform a login with email/password combo through Firebase.
 * 
 * @param string email 
 * @param string password 
 */
export async function onEmailLoginPress(isLoading, email, password) {

    //Report that loading has begun
    isLoading(true);

    let userData = await firebase.auth().signInWithEmailAndPassword(email, password).catch((e) => {return null});

    console.log("Firebase userData:", userData);

    if(!userData) {
        return {error_desc: "Incorrect username or password."}
    }

    let idTokenResult = await firebase.auth().currentUser.getIdTokenResult();

    const result = await firebaseLogin(idTokenResult).catch((error) => {
        console.log(error.code, "Error logging in:", error.message);

        return {error_desc: error.message};
    });

    console.log("Server login response:", result);

    return result;
}

/**
 * Handles Apple sign in on iOS devbices. Fails with an error if the current OS
 * does not support Apple sign in.
 * @param function isLoading 
 */
export async function onAppleButtonPress(isLoading) {
    //Show load wheel
    isLoading(true);

    //Check if the platform is supported first
    console.log("apple auth support:", appleAuth.isSupported);
    if(appleAuth.isSupported) {
        //This device is supported for native sign in so do that
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
            throw 'Apple Sign-In failed - no identify token returned';
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
        await firebase.auth().signInWithCredential(appleCredential);

        let idTokenResult = await firebase.auth().currentUser.getIdTokenResult().catch((e) => {
            console.log("Firebase (Apple) error:", e);
            return null;
        });

        let result = await firebaseLogin(idTokenResult);

        console.log("Server login response:", result);

        return result;
    } else {
        return {error_desc: "This device does not support Apple login."}
    }
}

/**
 * Performes Firebase login with Google creedentials
 * Requires a callback to show the loading dialog
 * @param function isLoading 
 */
export async function onGoogleButtonPress(isLoading) {
    //Report that loading has begun
    isLoading(true);

    // Get the users ID token
    const user = await GoogleSignin.signIn().catch((error) => console.log("Google Signing Failed:", error));

    if(!user) {
        return null;
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(user.idToken);

    await firebase.auth().signInWithCredential(googleCredential);

    let idTokenResult = await firebase.auth().currentUser.getIdTokenResult().catch((e) => {
        console.log("Firebase (Google) error:", e);
        return null;
    });

    let result = await firebaseLogin(idTokenResult);

    console.log("Server login response:", result);

    return result;
}

/**
 * Performes Firebase login with Facebook creedentials
 * Requires a callback to show the loading dialog
 * @param function isLoading 
 */
export async function onFacebookTokenReceived(isLoading, accessToken) {
    //Report that loading has begun
    isLoading(true);

    console.log("Ready to log Facebook with token:", accessToken);

    const credential = await auth.FacebookAuthProvider.credential(accessToken);
    await firebase.auth().signInWithCredential(credential)
        .catch((error) => {
            console.log("Firebase (Facebook) sign-in error", error);
        });
    
    console.log("Got Firebase (Facebook) credential:", credential);

    let idTokenResult = await firebase.auth().currentUser.getIdTokenResult().catch((e) => {
        console.log("Firebase (Facebook) error:", e);
        return null;
    });

    if(!idTokenResult.claims.email || idTokenResult.claims.email == "" || idTokenResult.claims.email == null) {
        console.log("(Facebook) No email provided");
        return {error_desc: "No email address provided."};
    }

    let result = await firebaseLogin(idTokenResult);

    console.log("Server login response:", result);

    return result;
}

/**
 * Sign out function. Not really used because the server
 * handles tokanisation.
 */
export async function onSignOutPress() {
    firebase.auth().signOut().then(() => {
        console.log("Signed out of Firebase");
    }).catch((error) => {
        console.log(error.code, "Error signing out of Firebase", error.message);
    });
}

/**
 * Fetches the various server data required to use the app:
 * program data, saved state data, toolkit activities, etc.
 * and saves them to local storage.
 * 
 * Returns FALSE on failure, OR object on success
 * {success (bool), message (string)}
 * 
 * Examples: 
 *  {success: false, message: "invalid survey"} - account not finished set up
 *  {success: true, message: ""} - successful login
 *  FALSE - should be treated as invalid password
 * 
 * @param {*} userCreds
 * @returns mixed
 */
export async function finaliseLogin(userCreds) {
    //If valid user credentials weren't provided then fail
    if(!userCreds) {
        console.log("LOGIN FAILURE: NULL returned");
        return false;
    }
    if(!userCreds.user_credential) {
        let error = "no error returned";
        if(userCreds.error_desc) {
            error = userCreds.error_desc;
        }
        console.log("LOGIN FAILURE: Error:", error);
        return {success: false, message: error};
    }
  
    //Always get a new program at login
    //The remote program contains the program activity list, the activity data, any saved activities, 
    //and the "explore" activity list.
    let serverProgram = await getRemoteProgram(userCreds);
    console.log("NEW PROGRAM:", serverProgram);
    //Check data is valid
    if(!serverProgram) {
        console.log("LOGIN FAILURE: Returned program is NULL");
        return false;
    }
    if(!serverProgram.program_v2) {
        console.log("LOGIN FAILURE: Returned program is invalid.");
        return false;
    }

    //Get the program component
    let newProgram = serverProgram.program_v2;

    //If the provided program has no start date, or the start date has expired, then do a survey.
    let keys = Object.keys(newProgram.program);
    //Check if the program returned has a valid start date
    if(!newProgram.program[keys[0]][0][0] || !newProgram.program[keys[0]][0][0].survey_response_program_start_date) {
        //No start date was provided. This means the program wasn't set up on the server.
        //Go to the account setup screen
        console.log("LOGIN PROBLEM: Invalid program provided, probably need to set up account.");
        return {success: false, message: "invalid program"};
    }

    let startDate = newProgram.program[keys[0]][0][0].survey_response_program_start_date.date.substring(0, 10);
    console.log("Program Start Date:", startDate);
          
    //Save program
    await saveProgram(newProgram);

    //If everything else succeeded, save the credentials to local storage for futrue login
    //NOTE: this is required for the following steps to work, which require these creds.
    await saveCreds(userCreds);

    //Fetch saved program data from the server for previous days of the program
    let savedUserData = await getRemoteProgramUserData()
    console.log("SAVED USER DATA:", savedUserData);

        
    //Save the list of "Toolkit" activities provided with the program
    //This is called "therapy room" in the object for historical reasons
    if(newProgram.therapy_room) {
        console.log("TOOLKIT ITEMS #:", newProgram.therapy_room.length);
        await saveToolkitActivities(newProgram.therapy_room)
    }

    //Store any saved activities or provided "explore" activities
    if(newProgram.explore_saved) {
        console.log("EXPLORE / SAVED ITEMS #:", newProgram.explore_saved.length);
        await setSavedActivities(newProgram.explore_saved);
    }
        

    return {success: true, message: ""};
}