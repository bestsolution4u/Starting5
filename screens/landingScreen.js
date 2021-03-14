/**
 * Contains both the loadingScreen, and landingScreen views.
 * TODO: combine these in to a single view?
 */
import React from 'react';
import { LogBox } from 'react-native';
import { View, SafeAreaView, Text, Image, Modal, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';

import {  } from "../controllers/remoteDB";
import { doLogOut } from "../controllers/localDB";
import { LoadingModal, ErrorModal } from "../controllers/helperFunctions";
import { SignupModal, EmailSignupModal } from "./preSurveyScreen";
import { LoginScreen } from "./loginScreen";

//Styles
import appStyle from "../styles/appStyle";
import landingStyle from "../styles/landingStyle";
import { finaliseLogin } from '../controllers/firebaseFunctions';
import { Alert } from 'react-native';

//Assets
const background = require("../assets/images/simon-maage-dark.jpg");
const s5 = require("../assets/S5.png");

/**
 * Displays the actual content of the landing screen - background video with buttons
 */
export class LandingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loginSuccess: false,
      loginComplete: false,
      loginData: {},
      showLogin: false, //show/hide the login modal
      error: null,
      showSignup: false, //show/hide the sign-up modal
      showEmailSignup: false, //Show / hide email signup
      signupData: {}, //Data for signing up
      userData: this.props.route.params.userData, //Any user login data that may have been returned from the sign-up screen
    };
  }

  /**
   * Once user data has been checked, this function prepares the screens and
   * local database to display the program data.
   * @param {*} userCreds 
   */
  completeLogin(userCreds) {

    finaliseLogin(userCreds).then((success) => {
      if(success) {
        if(success.success) {
          //Login was successful
          this.setState({isLoading: false, showLogin: false, showSignup: false, showEmailSignup: false});
          this.props.route.params.setLogin(true);
        } else {
          //Login oAuth was successful but there was a problem with the account
          //This probably just means there is no account on our servers,
          //OR the user blocked some details like email which we need.
          switch(success.message) {
            case "No email address provided.":
              //Make sure to log out Facebook if it was logged in
              LoginManager.logOut();

              this.setState({isLoading: false, showLogin: false, showSignup: false});
              Alert.alert("Login Error", "The provider that you are using hasn't supplied an email address. Please use the email signup instead.")
              break;

            case "Incorrect username or password.":
              this.setState({isLoading: false});
              Alert.alert("Login Error", "Incorrect username or password.");
              break;

            case "[Error: [auth/email-already-in-use] The email address is already in use by another account.]":
              this.setState({isLoading: false});
              Alert.alert("Login Error", "The user already exists. Please try resetting your password.");
              break;

            default:
              this.setState({isLoading: false, showLogin: false, showSignup: false, 
                showEmailSignup: false});
              //Complete account setup by going to the survey page
              this.props.navigation.navigate("PreSurvey", {userData: userCreds});
              break;
          }

        }
      } else {
        //Login was NOT successful
        this.setState({isLoading: false, error: "Incorrect username or password."});
      }
    }).catch((err) => console.log("NETWORK ERROR:", err));

  }

  /**
   * Some checks when the page first loads.
   */
  componentDidMount() {
    
    //Check that we weren't sent back here from the "log out" button
    if(this.props.route.name == "LOG OUT") {
      console.log("landing screen: ", "logging out");

      //If we were, then log out
      doLogOut();

      //Log out Facebook
      LoginManager.logOut();

      this.props.route.params.setLogin(false);
    }
    console.log("user data, if any:", this.state.userData);

    if(this.state.userData) {
      console.log("User data received, logging in...", this.state.userData);
    }
  }

  /**
   * Things to check if the component updates
   */
  componentDidUpdate() {

  }

  render() {
    //There is a "require cycle" in the track player library that I can't fix
    LogBox.ignoreLogs(['Require cycle:']);

    return (
      <SafeAreaView style={[landingStyle.mainBox]}>
        <ImageBackground source={background} style={landingStyle.backgroundImage}>

          {/* The Login Box */}
          <LoginScreen showLogin={this.state.showLogin} 
            hideLogin={() => this.setState({showLogin: false})}
            doFirebaseLogin={(deets) => this.completeLogin(deets)}
            isLoading={(state) => this.setState({isLoading: state})}
            />

          {/* The sign-up modal */}
          <SignupModal showSignup={this.state.showSignup}
            hideSignup={() => this.setState({showSignup: false})}
            completeSignup={(details) => this.completeLogin(details)}
            showEmailSignup={(state) => this.setState({showSignup: false, showEmailSignup: true})}
            isLoading={(state) => this.setState({isLoading: state})}
          />
          <EmailSignupModal showSignup={this.state.showEmailSignup}
            hideSignup={() => this.setState({showSignup: false, showEmailSignup: false})}
            completeSignup={(details) => this.completeLogin(details)}
            isLoading={(state) => this.setState({isLoading: state})}
          />
          
          {/* The error modal */}
          <ErrorModal showError={this.state.error ? true : false}
            error={this.state.error}
            dismissError={() => this.setState({error: null})}
          />

          <Image source={s5} style={landingStyle.s5Image} />

          <View style={landingStyle.headingTextBox}>
            <Text style={[appStyle.H3, landingStyle.headingText]}>
              Curated by industry professionals
            </Text>
            <Text style={[appStyle.H3, landingStyle.headingText]}>
              to boost your mental fitness
            </Text>
            <Text style={[appStyle.H3, landingStyle.headingText]}>
              and feel great.
            </Text>
          </View>

          <View style={landingStyle.buttonBox}>
            <TouchableOpacity style={[appStyle.defaultButton, {width: "80%"}]}
              onPress={() => this.setState({showSignup: true})}
            >
              <Text style={appStyle.buttonText}>START 7-DAY FREE TRIAL</Text>
            </TouchableOpacity>

            <LoadingModal isLoading={this.state.isLoading} />

            <View style={{marginTop: 20}}>
              <Text style={[appStyle.H3, {color: "white"}]}>Already have an account?</Text>
            </View>
            <TouchableOpacity style={[appStyle.secondaryButton, {width: "80%"}]}
              onPress={() => this.setState({showLogin: true})}
            >
              <Text style={appStyle.secondaryButtonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }
}