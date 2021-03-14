/**
 * A community portal where the user can post updates about their status.
 */
import React, {Fragment, useEffect} from 'react';
import { View, ScrollView, Text, Button, Image, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import MyHeader from "./headerFragment";

import appStyle from '../styles/appStyle';
import communityStyle from "../styles/communityStyle";

//Assets
const heartIcon = require("../assets/heart-icon.png");
const backArrows = require("../assets/arrows.png");

//Dummy Data
const post1 = {user: "standupforit", short_text: "I have been having a tough week with motivation. Does anyone have any tips?", date: "POSTED: 26.12.2020 @7am"};
const post2 = {user: "itsnotmeitsbooze", short_text: "One of my friends has been distancing from all gatherings. Does anyone have any advice on how to ask if someone is okay?", date: "POSTED: 26.12.2020 @6am"};
const post3 = {user: "freshperspective", short_text: "I just took a DNA test, turns out I'm 100% that bitch.", date: "POSTED: 24.12.2020 @10pm"};


/**
 * Individual post view component
 * TODO: this will need callbacks for the like and comment buttons
 */
class PostView extends React.Component {
  constructor(item, props) {
    super(item, props);
    this.state={};
  }

  render() {
    return (
      <View style={communityStyle.postMainBox} >
        <View style={communityStyle.postBodyBox}>
          <View style={communityStyle.postProfileBox} />
          {/* Text boxes */}
          <View style={communityStyle.postTextBox}>
            <Text style={[appStyle.H3, appStyle.bodyFontColour]}>{this.props.item.user}</Text>
            <Text style={appStyle.H3}>{this.props.item.short_text}</Text>
            <Text style={[appStyle.H4, {paddingTop: 10}]}>{this.props.item.date}</Text>
          </View>
          {/* Side buttons */}
          <View style={communityStyle.postSideBox}>
            <View style={communityStyle.postIconBox}>
              <Image source={heartIcon} style={communityStyle.iconImage} />
              <Text style={[appStyle.H4, {minWidth: 15, paddingLeft: 5}]}>10</Text>
            </View>
            <View style={communityStyle.postIconBox}>
              <Image source={heartIcon} style={communityStyle.iconImage} />
              <Text style={[appStyle.H4, {minWidth: 15, paddingLeft: 5}]}>10</Text>
            </View>
            <View style={communityStyle.postIconBox}>
              <TouchableOpacity style={communityStyle.postExpandBox}>
                <Image style={[communityStyle.arrowsImage, communityStyle.arrowsDown, {tintColor: "black"}]} source={backArrows}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Dashed line */}
        <View style={communityStyle.dottedLine} />
      </View>
    )
  }
}

/**
 * mIn view of the community screen. Displays a heding and some logic 
 * to display recent posts.
 */
export class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={appStyle.mainBox}>
        <MyHeader />

        <ScrollView style={appStyle.fullScreenScroll}>
            <Text style={[appStyle.H1, communityStyle.headingText]}>Community</Text>
          {/* Horizontal line */}
          <View style={appStyle.hBarBox}>
            <View style={appStyle.hLine} />
          </View>

          {/* Recent posts */}
          <PostView item={post1}/>
          <PostView item={post2}/>
          <PostView item={post3}/>

          {/* Older posts icon */}
          <TouchableOpacity style={communityStyle.olderPostsBox}>
            <View style={communityStyle.olderPostsCircle}>
              <Image style={[communityStyle.arrowsImage, communityStyle.arrowsDown]} source={backArrows}/>
            </View>
            <Text style={appStyle.H3}>OLDER POSTS</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    )
  }
}