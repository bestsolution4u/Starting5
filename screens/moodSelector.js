/**
 * A class which allows the user to select their mood from some 
 * smiley faces in a small box.
 */
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Card , Button, Icon, Overlay } from 'react-native-elements';
import Slider from '@react-native-community/slider';
//Styles
import appStyle from "../styles/appStyle";
import moodStyle from "../styles/moodSelectorStyle";

//Assets



/**
 * A mood selector modal which gives sliders for the user
 * to select how they are currently feeling.
 */
export const MoodSelector = (props) => {
  let sliderValues = {energy: 0.5, mood: 0.5, motivation: 0.5};

  return(
    <SafeAreaView style={{flex: 1}}>
      <Overlay isVisible={props.showModal}
        overlayStyle={moodStyle.modalBox}
        >
          <ScrollView>

            {/* Heading Box */}
            <View style={appStyle.headingBox}>
              <Text style={appStyle.H4}>MENTAL FITNESS CHECK IN</Text>
            </View>

            {/* Greeting text */}
            <View style={[appStyle.bodyBox, {marginTop: 20}]}>
              <Text style={appStyle.H4}>Hey {props.name},</Text>
              <Text style={appStyle.H4}>How are you feeling today?</Text>
            </View>


            {/* The sliders */}
            <View style={moodStyle.slidersMainBox}>
              <Text style={appStyle.H4}>MOOD</Text>
              <Slider
                style={moodStyle.sliderStyle}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                value={0.5}
                thumbTintColor="#000000"
                onSlidingComplete={(value) => sliderValues.mood=value}
              />

              <Text style={appStyle.H4}>ENERGY</Text>
              <Slider
                style={moodStyle.sliderStyle}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                value={0.5}
                thumbTintColor="#000000"
                onSlidingComplete={(value) => sliderValues.energy=value}
              />

              <Text style={appStyle.H4}>MOTIVATION</Text>
              <Slider
                style={moodStyle.sliderStyle}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                value={0.5}
                thumbTintColor="#000000"
                onSlidingComplete={(value) => sliderValues.motivation=value}
              />
            
            </View>

            <View style={moodStyle.bottomBox}>
              <TouchableOpacity style={appStyle.secondaryButton}
                onPress={() => props.hideModal(true)}
              >
                <Text style={appStyle.secondaryButtonText}>SKIP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={appStyle.defaultButton}
                onPress={() => props.saveMood(sliderValues)}
              >
                <Text style={appStyle.buttonText}>LOG YOUR MOOD</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
      </Overlay>
    </SafeAreaView>
  )
}