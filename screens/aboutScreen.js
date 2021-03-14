/**
 * Displays a form which the user can submit to the app owners
 */
import React from 'react';
import { View, Text, ScrollView, Image, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';

import MyHeader from "./headerFragment";

//Styles
import appStyle from '../styles/appStyle';
import aboutStyle from "../styles/aboutStyle";


import { getUserData } from "../controllers/localDB";
import { sendRemoteFeedback } from "../controllers/remoteDB";
import { ErrorModal } from "../controllers/helperFunctions";

//Assets
const paulAndMel = require("../assets/paul-mel-beach.jpg");

//Text
const bodyText = "Starting Five was founded by two friends, Paul Elderkin and Melissa Lionnet when in 2019, both lost a loved one to suicide. They both felt like they hit rock bottom and needed to start rebuilding themselves. Paul started using the concept of a Daily 5 checklist in his daily life and found...";
const bottomText = "Whatever it may be, sharing the load with someone else can really help. We promote the following organisations and always encourage you to seek further suppport.";

/**
 * Entry point of the contact us screen. Where users can contact the
 * app owners.
 */
export class AboutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null, //user credentials
      error: null,
    };
  }

  componentDidMount() {

  }
  

  render() {
    return (
      <View style={appStyle.mainBox}>

        <MyHeader />
          <ScrollView style={{width: "100%", backgroundColor: "white"}}>

            <View style={aboutStyle.topBox}>
              <Image source={paulAndMel} style={aboutStyle.headingImage} />
            </View>

            <View style={aboutStyle.bodyBox}>
              <Text style={[appStyle.H3, {color: "white"}]}>About Us</Text>
              <Text style={[appStyle.H4, {color: "white", marginTop: 20}]}>{bodyText}</Text>
            </View>

            <View style={{backgroundColor: "black", width: "100%", paddingTop: 20}}>
              <TouchableOpacity style={[appStyle.defaultButton, {width: "90%", alignSelf: "center"}]}
              onPress={() => this.props.navigation.navigate("Contact")}
              >
                <Text style={appStyle.buttonText}>CONTACT US</Text>
              </TouchableOpacity>
            </View>


            <View style={aboutStyle.bottomBox}>

              <Text style={[appStyle.H4]}>{bottomText}</Text>

              <View style={{height: 200}}>

              </View>

              <TouchableOpacity style={[appStyle.defaultButton, {width: "95%"}]}
                onPress={() => this.props.navigation.goBack()}>
                <Text style={appStyle.buttonText}>BACK</Text>
              </TouchableOpacity>
            </View>

        </ScrollView>
      </View>
    )
  }
}