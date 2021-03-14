import React from 'react';
import { View, Text, Image, ScrollView, Modal, TextInput, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import { Card , Button, Icon, Overlay } from 'react-native-elements';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';

import { onAppleButtonPress, onGoogleButtonPress, onEmailSignupPress, onFacebookTokenReceived } from "../controllers/firebaseFunctions";

//Styles
import appStyle from "../styles/appStyle";
import preSurveyStyle from "../styles/preSurveyStyle";

const OS = Platform.OS;

//Assets
const starting5 = require('../assets/starting-5.png');
const s5Logo = require('../assets/logo.png');
const background = require("../assets/images/fabio-jock.jpg");
const s5 = require("../assets/S5.png");

/**
 * Initial entry point for the SignUp process.
 * Displays the various social media signup options.
 * Required props:
 * showSignup - flag to show the modal
 * hideSignup - callback to hide the signup box
 * doSignup - callback to finalise the signup
 * @param {*} props 
 */
export const SignupModal = (props) => {
    
  return (
    <Modal
    transparent={true}
    animationType={'none'}
    visible={props.showSignup}>
    <View style={appStyle.modalBackground}>
      <View style={preSurveyStyle.loginModalBox}>

        {/* Heading Box */}
        <View style={appStyle.headingBox}>
          <Text style={appStyle.headerText}>LET'S BEGIN</Text>
        </View>



        {/* Buttons */}
        <View style={{alignItems: "center"}}>
          
        <TouchableOpacity style={[appStyle.secondaryButton, {marginBottom: 10}]}
              onPress={() => props.showEmailSignup(true)}
            >
              <Text style={appStyle.secondaryButtonText}>SIGN UP WITH EMAIL</Text>
            </TouchableOpacity>
            
            {/* Show the O-Auth login buttons */}
            {OS == "ios" ?
              <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                  width: "90%",
                  height: 45,
                  marginBottom: 20,
                }}
                onPress={() => {
                  onAppleButtonPress(props.isLoading).then((userCreds) => props.completeSignup(userCreds))}}
              />
            :
              <GoogleSigninButton
                style={{width: "90%", height: 48, marginBottom: 20}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => onGoogleButtonPress(props.isLoading).then((userCreds) => props.completeSignup(userCreds))}
              />
            }

            <LoginButton
              publishPermissions={['public_profile', 'email']}
              onLoginFinished={
                  (error, result) => {
                  if (error) {
                      console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                      console.log("login is cancelled.");
                  } else {
                      AccessToken.getCurrentAccessToken().then(
                      (data) => {
                          onFacebookTokenReceived(props.isLoading, data.accessToken)
                            .then((userCreds) => props.completeSignup(userCreds));
                      }
                      );
                      console.log("FB Login success.");
                  }
                  }
              }
              style={{height: 30, width: "90%", marginBottom: 20, justifyContent: "center"}}
            />

          <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]}
            onPress={() => props.hideSignup()}
          >
            <Text style={appStyle.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
  );
}

/**
 * A modal that takes email, password, and name and performs
 * email-based signup with Firebase
 */
export class EmailSignupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_email: "", //Signup credentials
      user_password1: "",
      user_password2: "",
      passwordCriteria: false, //Flag for when password complexity criteria are met
      emailCriteria: false, //Flag for email complexity criteria
      first_name: "",
      last_name: "",
    };
  }

  /**
   * Check the credentials against complexity criteria and then
   * updates the state.
   */
  checkCredentials() {
    
    //Check criteria for allowing the user to sign up
    let passwordCriteria = false;
    if(this.state.user_password1.length > 6) {
      //Check length rule
      if(this.state.user_password2 === this.state.user_password1) {
        //Check if passwords match
        passwordCriteria = true;
      }
    }
    this.setState({passwordCriteria});

    //Check email criteria
    let emailCriteria = false;
    if(this.state.user_email.length > 5) {
      let reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
      if (reg.test(this.state.user_email) === false) {
      }
      else {
        emailCriteria = true;
      }
    }
    this.setState({emailCriteria});

    //Check first/last name
    let nameCriteria = false;
    if(this.state.first_name.length > 1) {
      nameCriteria = true;
    }
    this.setState({nameCriteria});
  }

  render() {
    return (
      <Modal
      transparent={true}
      animationType={'none'}
      visible={this.props.showSignup}>
      <View style={appStyle.modalBackground}>
        <View style={preSurveyStyle.loginModalBox}>

          {/* Heading Box */}
          <View style={appStyle.headingBox}>
            <Text style={appStyle.headerText}>EMAIL SIGN UP</Text>
          </View>
          
          {/* Input Boxes */}
          <View style={{flexDirection: "row"}}>
          <TextInput style={preSurveyStyle.textInput} 
                    numberOfLines={1} 
                    editable={true}
                    placeholder={"Email"}
                    textContentType={"username"}
                    onChangeText={(value) => this.setState({user_email: value}, this.checkCredentials)}
                    />
                    {this.state.emailCriteria ?
                      <Icon name={"check-circle"} 
                                type="font-awesome" 
                                size={16}
                                color={"green"}
                                containerStyle={{top: 10, position: "absolute", right: 10}}
                              />
                      :
                      <Icon name={"times-circle"} 
                        type="font-awesome" 
                        size={16}
                        color={"red"}
                        containerStyle={{top: 10, position: "absolute", right: 10}}
                      />
                    }
            </View>

            
          <View style={{flexDirection: "row"}}>
            <TextInput style={[preSurveyStyle.textInput, {width: "50%"}]} 
                      numberOfLines={1} 
                      editable={true}
                      placeholder={"First Name"}
                      textContentType={"name"}
                      onChangeText={(value) => this.setState({first_name: value}, this.checkCredentials)}
                      />
            <TextInput style={[preSurveyStyle.textInput, {width: "30%"}]} 
                      numberOfLines={1} 
                      editable={true}
                      placeholder={"Last Name"}
                      textContentType={"name"}
                      onChangeText={(value) => this.setState({last_name: value})}
                      />
            {this.state.nameCriteria ?
              <Icon name={"check-circle"} 
                        type="font-awesome" 
                        size={16}
                        color={"green"}
                        containerStyle={{top: 10, position: "absolute", right: 10}}
                      />
              :
              <Icon name={"times-circle"} 
                type="font-awesome" 
                size={16}
                color={"red"}
                containerStyle={{top: 10, position: "absolute", right: 10}}
              />
            }
            </View>
          
          <TextInput style={preSurveyStyle.textInput} 
                    numberOfLines={1} 
                    editable={true}
                    placeholder={"Password"}
                    textContentType={"password"}
                    secureTextEntry={true}
                    onChangeText={(value) => this.setState({user_password1: value}, this.checkCredentials)}
                    />
          <View style={{flexDirection: "row"}}>
          <TextInput style={[preSurveyStyle.textInput]} 
                    numberOfLines={1} 
                    editable={true}
                    placeholder={"Verify Password"}
                    textContentType={"password"}
                    secureTextEntry={true}
                    onChangeText={(value) => this.setState({user_password2: value}, this.checkCredentials)}
                    />
                  {this.state.passwordCriteria ?
                    <Icon name={"check-circle"} 
                      type="font-awesome" 
                      size={16}
                      color={"green"}
                      containerStyle={{top: 10, position: "absolute", right: 10}}
                    />
                    :
                    <Icon name={"times-circle"} 
                      type="font-awesome" 
                      size={16}
                      color={"red"}
                      containerStyle={{top: 10, position: "absolute", right: 10}}
                    />
                  }
          </View>

          {/* Buttons */}
          <View style={{alignItems: "center"}}>
            <TouchableOpacity style={appStyle.secondaryButton}
              onPress={() => onEmailSignupPress(this.props.isLoading, this.state.user_email, this.state.user_password1, this.state.first_name, this.state.last_name)
                .then((newCreds) => this.props.completeSignup(newCreds)) }
              disabled={this.state.emailCriteria && this.state.passwordCriteria && this.state.nameCriteria ? false : true}
            >
              <Text style={[appStyle.secondaryButtonText, this.state.emailCriteria && this.state.nameCriteria && this.state.passwordCriteria ? null : {color: "gray"}]}>SIGN UP</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]}
              onPress={() => this.props.hideSignup()}
            >
              <Text style={appStyle.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    );
  }
}

/**
 * Just a screen with a button to set up the user's account (take the survey)
 */
export class PreSurveyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

  return (
    <SafeAreaView style={[preSurveyStyle.mainBox]}>
    <ImageBackground source={background} style={preSurveyStyle.backgroundImage}>

      <View style={{marginLeft: 20}}>
        <Image source={s5} style={preSurveyStyle.s5Image} />

        <View style={{width: "100%", alignItems: "center"}}>
          <View style={preSurveyStyle.headingTextBox}>

            <Text style={[appStyle.H2, preSurveyStyle.headingText]}>
              Hey, {this.props.route.params.userData ? this.props.route.params.userData.user_first_name : null}
            </Text>
            <Text style={[appStyle.H2, preSurveyStyle.headingText]}>
              Welcome to the team!
            </Text>
            <Text style={[appStyle.H3]}>
              Take a moment to set up your personal profile.
            </Text>
          </View>
        </View>
      </View>

      <View style={preSurveyStyle.buttonBox}>
        <TouchableOpacity style={[appStyle.defaultButton, {width: "70%"}]}
          onPress={() => this.props.navigation.navigate("Survey", {userData: this.props.route.params.userData})}
        >
          <Text style={appStyle.buttonText}>SET UP MY PROFILE</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </SafeAreaView>
  );
  }
}