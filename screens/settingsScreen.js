/**
 * Displays My Account and app settings. Change password, delete account, etc.
 */
import React, {Fragment, useEffect} from 'react';
import { View, Text, ScrollView, Image, Modal, TextInput, Alert, TouchableOpacity, Linking } from 'react-native';
import { Icon } from 'react-native-elements';

import MyHeader from "./headerFragment";

//Styles
import appStyle from '../styles/appStyle';
import settingsStyle from "../styles/settingsStyle";


import { getUserData } from "../controllers/localDB";
import {  } from "../controllers/remoteDB";
import { ErrorModal, isUserPro, isUserSubscribed, isUserDeveloper } from "../controllers/helperFunctions";

//Some constants
const faqURL = "https://www.startingfive.com.au";

/**
 * Show a "change password" dialog box for the user.
 * 
 * @param {*} props 
 */
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "", //User's old and new passwords
      newPassword1: "",
      newPassword2: "",
      passwordCheck: false, //State for when password change fits reqruied rules
    };
  }

  /**
   * Checks password rules if a change has occured and reports
   * when the rules are met.
   */
  checkChange() {
    if(this.state.newPassword1.length > 6) {
      if(this.state.newPassword1 == this.state.newPassword2) {
        this.setState({passwordCheck: true});
      }
    }
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.showChangePassword}>
        <View style={appStyle.modalBackground}>
          <View style={settingsStyle.changePasswordModalBox}>

            {/* Heading Box */}
            <View style={appStyle.headingBox}>
              <Text style={appStyle.headerText}>CHANGE PASSWORD</Text>
            </View>
            
            {/* Input Boxes */}
            <TextInput style={appStyle.textInput} 
              numberOfLines={1} 
              editable={true}
              placeholder={"Old Password"}
              textContentType={"password"}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({oldPassword: value}, this.checkChange)}
            />

            <TextInput style={appStyle.textInput} 
              numberOfLines={1} 
              editable={true}
              placeholder={"New Password"}
              textContentType={"password"}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({newPassword1: value}, this.checkChange)}
            />

            <View style={{flexDirection: "row"}}>
              <TextInput style={appStyle.textInput} 
                numberOfLines={1} 
                editable={true}
                placeholder={"Confirm New Password"}
                textContentType={"password"}
                secureTextEntry={true}
                onChangeText={(value) => this.setState({newPassword2: value}, this.checkChange)}
              />
              {/* Check if passwords match */ }
              {this.state.passwordCheck ?
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
              <TouchableOpacity style={[appStyle.secondaryButton, 
                  {marginBottom: 10}, 
                ]}
                onPress={() => console.log("Change password")}
                disabled={this.state.passwordCheck ? false : true}
              >
                <Text style={[appStyle.secondaryButtonText,
                  this.state.passwordCheck ? null : {color: "gray"}
                ]}>CHANGE</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]}
                onPress={() => this.props.hideChangePassword()}
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
 * Generic menu item type.
 * Required props:
 * - Text
 * - Sub-Text
 * - Action (callback)
 * 
 * @param {*} props 
 */
const MenuItem = (props) => {
  //Determine if a right facing arrow should be shown
  //If there is an action to perform, AND the user has not overridden the option
  let showArrow = false;
  if(props.action) {
    showArrow = true;
    if(props.showArrow == false) {
      showArrow = false;
    }
  }

  return( 
    <TouchableOpacity style={settingsStyle.menuItem}
        onPress={() => props.action ? props.action() : null}
        disabled={props.action ? false : true}
      >
      <View style={{alignSelf: "flex-start", justifyContent: "center", height: "100%"}}>
        {props.text ? 
          <Text style={[appStyle.H4]}>{props.text}</Text>
          :
          null
        }
        {props.subtext ? 
          <Text style={[appStyle.H5, {color: "gray"}]}>{props.subtext}</Text>
          :
          null
        }
      </View>
      {/* If an action is set then show the arrow */}
      { showArrow ?
        <View style={{position: "absolute", right: 10,}}>
          <Icon name={"angle-right"} 
            type="font-awesome" size={60} 
          />
        </View>
      :
        null
      }
    </TouchableOpacity>
  )
}

/**
 * Main display which lists the various settings
 */
export class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null, //an friendly message box
      userData: null, //User's data
      changePasswordModal: false, //change password modal box
    };
  }

  componentDidMount() {
    //Get the user data
    getUserData().then(result => {
      this.setState({userData: result});
    });
  }

  finish() {
    this.setState({error: null});
    this.props.navigation.goBack();
  }

  userSubscriptionDetails() {
    //Debug info checking if the user is pro or developer etc.
    isUserPro().then((isPro) => {
      isUserDeveloper().then((isDev) => {
        isUserSubscribed().then((isSubscribed) => Alert.alert("User Subscription Details",
        "Is User Pro:" + isPro + "\nIs User Developer:" + isDev + "\nIs User Subscribed:" + isSubscribed));
      })
    });
  }
  

  render() {
    return (
      <View style={appStyle.mainBox}>

        <MyHeader />
          <ScrollView style={{width: "100%"}}>

            
            {/* Success / Error Modal */}
            <ErrorModal showError={this.state.error ? true : false} error={this.state.error} dismissError={() => this.finish()} />

            {/* Change password modal */}
            <ChangePassword showChangePassword={this.state.changePasswordModal} 
              hideChangePassword={() => this.setState({changePasswordModal: false})} 
            />

            <View style={appStyle.headingBox}>
              <Text style={[appStyle.H3, {textAlign: "center"}]}>MY ACCOUNT</Text>
            </View>

            {/** The menu items */}
            <ScrollView>
              <MenuItem text={this.state.userData ? this.state.userData.user_credential.user_first_name + " " + this.state.userData.user_credential.user_last_name : null}
                subtext={this.state.userData ? "STARTING FIVE MEMBER SINCE " + Date(this.state.userData.user_credential.user_created.date).toString().toUpperCase().substr(4, 11) : null}
                action={() => this.userSubscriptionDetails()}
                showArrow={false}
              />
              <MenuItem text={"Subscription"} action={() => this.props.navigation.navigate("Payment")}
                subtext={"SUBSCRIPTION STATUS"}
              />
              <MenuItem text={"Facebook"} action={() => console.log("Social media connection")}
                subtext={"CONNECTED"}
              />
              <MenuItem text={"Change Password"} action={() => this.setState({changePasswordModal: true})}/>
              <MenuItem text={"Contact Us"} action={() => this.props.navigation.navigate("Contact")} showArrow={false}/>
              <MenuItem text={"FAQ"} action={
                () => Linking.openURL(faqURL).catch((err) => console.error('An error occurred', err))} 
                showArrow={false} />
              <MenuItem text={"Privacy Policy"}/>
              <MenuItem text={"Terms and Conditions"}/>
              <MenuItem text={"Delete Account"} action={() => console.log("Delete Account")} showArrow={false}/>
              <MenuItem text={"Log Out"} action={() => {
                  Alert.alert(
                    "Log Out",
                    "Are you sure you want to log out?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () =>  this.props.navigation.navigate("LOG OUT")}
                    ],
                    { cancelable: true }
                  );
                }
                }
                showArrow={false}/>

            </ScrollView>

            <View style={settingsStyle.bottomBox}>
                <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]}
                  onPress={() => this.props.navigation.goBack()}>
                  <Text style={appStyle.buttonText}>BACK</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
      </View>
    )
  }
}