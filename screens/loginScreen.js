import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, Image, Modal, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

import { onAppleButtonPress, onGoogleButtonPress, onEmailLoginPress, onFacebookTokenReceived } from "../controllers/firebaseFunctions";

//Styles
import appStyle from "../styles/appStyle";
import landingStyle from "../styles/landingStyle";


const OS = Platform.OS;


export const LoginScreen = (props) => {
  //The login data
  let userCreds = {user_email: "", user_password: ""};
    
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={props.showLogin}>
      <View style={appStyle.modalBackground}>
        <View style={landingStyle.loginModalBox}>

          {/* Heading Box */}
          <View style={appStyle.headingBox}>
            <Text style={appStyle.headerText}>LOGIN</Text>
          </View>
          
          {/* Input Boxes */}
          <TextInput style={landingStyle.textInput} 
            numberOfLines={1} 
            editable={true}
            placeholder={"Username / Email"}
            textContentType={"username"}
            onChangeText={(value) => userCreds.user_email = value}
          />
          
          <TextInput style={landingStyle.textInput} 
            numberOfLines={1} 
            editable={true}
            placeholder={"Password"}
            textContentType={"password"}
            secureTextEntry={true}
            onChangeText={(value) => userCreds.user_password = value}
          />

          {/* Buttons */}
          <View style={{alignItems: "center"}}>
            <TouchableOpacity style={[appStyle.secondaryButton, {marginBottom: 10}]}
              onPress={() => onEmailLoginPress(props.isLoading, userCreds.user_email, userCreds.user_password)
                .then((userCreds) => props.doFirebaseLogin(userCreds))
              }
            >
              <Text style={appStyle.secondaryButtonText}>LOG IN</Text>
            </TouchableOpacity>
            
            {/* Show the O-Auth login buttons */}
            {OS == "ios" ?
              <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                  width: "90%",
                  height: 48,
                  marginBottom: 20,
                }}
                onPress={() => {
                  onAppleButtonPress(props.isLoading).then((userCreds)=> props.doFirebaseLogin(userCreds))}}
              />
            :
              <GoogleSigninButton
                style={{width: "90%", height: 48, marginBottom: 20}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => onGoogleButtonPress(props.isLoading).then((userCreds) => props.doFirebaseLogin(userCreds))}
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
                            .then((userCreds) => props.doFirebaseLogin(userCreds));
                      }
                      );
                      console.log("FB Login success.");
                  }
                  }
              }
              style={{height: 30, width: "90%", marginBottom: 20, justifyContent: "center"}}
            />
            
            <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]}
              onPress={props.hideLogin}
            >
              <Text style={appStyle.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    );
  }