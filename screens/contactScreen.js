/**
 * Displays a form which the user can submit to the app owners
 */
import React, {Fragment, useEffect} from 'react';
import { View, Text, ScrollView, Image, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import DeviceInfo from "react-native-device-info";

import MyHeader from "./headerFragment";

//Styles
import appStyle from '../styles/appStyle';
import contactStyle from "../styles/contactStyle";


import { getUserData } from "../controllers/localDB";
import { sendRemoteFeedback } from "../controllers/remoteDB";
import { ErrorModal } from "../controllers/helperFunctions";

//Assets
const paulAndMel = require("../assets/paul-and-mel.jpg");


/**
 * Entry point of the contact us screen. Where users can contact the
 * app owners.
 */
export class ContactScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null, //user credentials
      user_name: null, //User input values
      user_email: null,
      user_phone: null,
      user_enquiry: null,
      user_subject: null,
      error: null,
      buildNumber: DeviceInfo.getBuildNumber(),
    };
  }

  componentDidMount() {
    //Get the user data
    getUserData().then(result => {
      this.setState({userData: result, user_name: result.user_credential.user_first_name, user_email: result.user_credential.user_email});
    });
  }

  /**
   * Collate the responses and send them to the server
   */
  sendFeedback() {
    let version = DeviceInfo.getVersion();
    let build = DeviceInfo.getBuildNumber();
    let os = DeviceInfo.getModel();


    let user_response = {
      name: this.state.user_name,
      email: this.state.user_email,
      phone: this.state.user_phone ? this.state.user_phone : "",
      enquiry: this.state.user_enquiry,
      info: this.state.user_subject ? this.state.user_subject : "",
      attachment: "Version Number: " + version.toString() + ", Build: " + build.toString() + ", Device OS: " + os.toString(),
    }


    sendRemoteFeedback(user_response).then((response) => {
      console.log("Feedback response:", response);
    });

    this.setState({error: "Thank you! Your feedback has been sent to the Starting Five team."});
  }

  finish() {
    this.setState({error: null});
    this.props.navigation.goBack();
  }
  

  render() {
    return (
      <View style={appStyle.mainBox}>

        <MyHeader />
          <ScrollView style={{width: "100%"}}>

            
            {/* Success / Error Modal */}
            <ErrorModal showError={this.state.error ? true : false} error={this.state.error} dismissError={() => this.finish()} />

            <View style={appStyle.headingBox}>
              <Text style={[appStyle.H3, {textAlign: "center"}]}>CONTACT US</Text>
            </View>

            <View style={contactStyle.bodyBox}>
              
              <View style={contactStyle.formItem}>
                <View style={contactStyle.formItemTitle}>
                  <Text style={[appStyle.H4, {fontWeight: "bold"}]}>SUBJECT</Text>
                </View>
                <TextInput style={contactStyle.textInput} 
                  onChangeText={(value) => this.setState({user_subject: value})}
                  numberOfLines={1}/>
              </View>

              <View style={contactStyle.formItem}>
                <View style={contactStyle.formItemTitle}>
                  <Text style={[appStyle.H4, {fontWeight: "bold"}]}>MESSAGE</Text>
                </View>
                <TextInput style={[contactStyle.textInput, {height: 200, textAlignVertical: "top"}]} 
                  numberOfLines={8} 
                  onChangeText={(value) => this.setState({user_enquiry: value})}
                  multiline={true}/>
              </View>
            </View>

            {/* Show the app build number for reference */}
            <View style={{marginLeft: 20}}>
              <Text style={{color: "lightgray", fontSize: 12}}>Build {this.state.buildNumber}</Text>
            </View>

            <View style={contactStyle.bottomBox}>
                <TouchableOpacity style={[appStyle.secondaryButton, {width: "90%"}]}
                onPress={() => this.sendFeedback()}
                >
                  <Text style={appStyle.secondaryButtonText}>SUBMIT</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[appStyle.defaultButton, {width: "90%"}]}
                  onPress={() => this.props.navigation.goBack()}>
                  <Text style={appStyle.buttonText}>Cancel</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
      </View>
    )
  }
}