/**
 * This is just a class that displays some text on a blank screen for testing purposes.
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ImageBackground, TouchableHighlight
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Card , Button, Icon, Overlay } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';

import {getActivityFocusString, getFocusString, isUserPro, smallScreenWidth} from "../controllers/helperFunctions";
import { setSavedActivity, deleteSavedActivity, isActivitySaved, likeActivity, isActivityLiked, completeActivity } from "../controllers/localDB";
import { getURIPrefix } from "../controllers/remoteDB";
import { ActivityCompleteModal } from "./activityScreen";

//Styles
import appStyle from '../styles/appStyle';
import activityStyle from "../styles/activityStyle";
import ActionSheet from "../controllers/ActionSheet";

//Assets
const activityImage = require("../assets/images/person-standing-on-a-rock.jpg");
const bodyImage = require("../assets/images/photo-of-woman-doing-exercise-square.jpg");
const mindImage = require("../assets/images/man-in-black-shorts-sitting-on-floor.jpg");
const communityImage = require("../assets/images/two-women-sitting-on-white-bench.jpg");
const foodImage = require("../assets/images/female-hand-holding-a-bowl-of-green-vegetables.jpg");
const therapyImage = require("../assets/images/women-sitting-on-brown-wooden-chair.jpg");
const heartIcon = require("../assets/icons/heart-icon.png");
const heartIconFilled = require("../assets/icons/heart-icon-filled.png");
const flagIcon = require("../assets/icons/flag-icon.png");
const flagIconFilled = require("../assets/icons/flag-icon-filled.png");
const tickIcon = require("../assets/tick-icon.png");
const heartIconPink = require("../assets/heart-icon-pink.png");
const closeButton = require("../assets/close-button.png");

/**
 * Renders the provided activities in a carousel format.
 * Accepts an array of activityDetails.
 *
 * Required props:
 * activityDetails - an array of activities to show
 * activityModal - a callback to the parent class to show the modal
 * slotIndex - the index (0 to 4) of this slot of activities
 * completedSlots - reference to the completed activities for the day
 * Optional Props:
 * toolkitItem - TRUE if this item came from the toolkit
 * savedActivity - True if this item came from the saved activity list
 */
export class ActivityFragment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPro: false,
      activeIndex: 0, //Updates when an item is swiped
      slotIndex: this.props.slotIndex, //Which daily activity slot is this
      carouselItems: this.props.activityDetails, //All of the items in this carousel
      uriPrefix: null,
      width: 100,
      height: 100,
      showActionSheet: false,
      showCompleteConfirmModal: false,
    };
    Dimensions.addEventListener("change", (e) => {
      this.setState(e.window);
  });
  }

  //Measure the window we're looking at for proper centering
  componentDidMount() {
    this.setState({width: Dimensions.get("window").width});
    this.setState({activeIndex: 0});

    //Get the fully qualified web address for images
    getURIPrefix().then((result) => this.setState({uriPrefix: result}));

    isUserPro().then((isPro) => this.setState({isPro: isPro}));
  }

  //If the parent screen has updated the state with new data then re-render the panel
  componentDidUpdate(prevProps) {
    //Only change state if new data were received - otherwise we get stuck in an infinite loop
    if(prevProps.activityDetails !== this.props.activityDetails ) {
      this.setState({carouselItems: this.props.activityDetails, activeIndex: 0});
      if(this.state.carouselRef) {
        this.state.carouselRef.snapToItem(0);
      }
    }
  }

  /**
   * The individual items that will be rendered here.
   */
  _renderItem = ({item,index}) => {
    //Select the appropriate background image and box colours
    let backgroundImage = activityImage;

    //Insert some dummy images for now
    let imageURI = null;

    //When the full URL is available, then reference the remote image
    if(this.state.uriPrefix) {
      if(item.activity_id) {
        imageURI = {uri: this.state.uriPrefix + item.activity_image};
      }
    }

    return (
      <View>
        <TouchableOpacity style={[
          activityStyle.fragmentBox,
          item.disabled ? {opacity: 0.33} : null, //Show in a disabled state if completed
          this.state.width < smallScreenWidth ? {marginLeft: 0} : null, //Bunch it up on small screens
          ]}
          disabled={item.disabled}
          onPress={() => this.props.activityModal(true, item, {slot: this.state.slotIndex, index: this.state.activeIndex, id: item.activity_id})}>

            {/* Display image but include adjustment for small screens */}
            <Image
              source={imageURI ? imageURI : backgroundImage}
              style={[activityStyle.activityImage, this.state.width < smallScreenWidth ? {width: 80, height: 80} : null]} />

            <View style={[activityStyle.textOverlayBox]}>
              <View style={{flex: 1, justifyContent: "flex-start", width: "100%", marginTop: 5}}>
                <Text style={[appStyle.H5, {color: "gray", fontSize: 10}]}>{getActivityFocusString(item).toUpperCase()}</Text>
              </View>

              <View style={[{flex: 2, height: "100%", justifyContent: "center"}, this.props.toolkitItem ? {top: -10, width: "100%"} : {width: "90%"}]} >
                {this.props.toolkitItem ?
                  <Text style={[appStyle.H3, {flexWrap: "wrap", width: "80%", fontSize: 14, maxHeight: 46, overflow: "hidden"}]}>{item.activity_title}</Text>
                :
                  <Text style={[appStyle.H3, {flexWrap: "wrap", width: "80%", fontSize: 14, overflow: "hidden"}]}>{item.activity_title}</Text>
                }
              </View>

              {/* Display either the duration and equipment for workout activities, or the blurb for mind activities */}
              <View style={[{flex: 1, flexWrap: "nowrap", overflow: "hidden", marginTop: 5, marginBottom: 10}, this.props.toolkitItem ? {top: -20} : {justifyContent: "flex-end"}]}>
              {
                this.props.toolkitItem ?
                  <Text style={[appStyle.H6]}>{item.activity_blurb.replace(/(<([^>]+)>)/gi, "")}</Text>
                :
                  <View>
                    <Text style={[appStyle.H5, {fontWeight: "bold"}]}>{item.activity_info_text_1} | {item.activity_info_text_3}</Text>
                  </View>
              }
              </View>

            </View>

          </TouchableOpacity>
        </View>
    )
  }

  /**
   * Small markers underneeth the carousel to show which
   * particular item is selected.
   */
  get pagination () {
    const { carouselItems, activeIndex } = this.state;

    return (
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeIndex}
        containerStyle={{ marginBottom: -40, padding: 0, top: -30 }}
        dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 8,
            backgroundColor: 'black',
            padding: 0,
            margin: 0,
            marginLeft: -20,
        }}
        inactiveDotStyle={{
            // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  /**
   * Close menu
   */
  closeActionSheet = () => this.setState({showActionSheet: false})

  /**
   * close activity complete confirm dialog
   */
  closeCompleteConfirmDialog = () => this.setState({showCompleteConfirmModal: false})

  /**
   * mark activity as completed
   */
  markActivityCompleted() {
    const {activeIndex, slotIndex, carouselItems} = this.state;
    console.log("State:", this.state);
    completeActivity(
        carouselItems[activeIndex].day_of_program,
        {slot: slotIndex, index: activeIndex, id: carouselItems[activeIndex].activity_id})
        .then(result => {
          this.props.forceRefresh();
        });
  }

  /**
   * render menu as modal when clicking menu icon
   */
  renderMenu() {
    return(
        <Modal
          isVisible={this.state.showActionSheet}
          style={{
            margin: 0,
            justifyContent: 'flex-end'
          }}>
          <ActionSheet
              actionItems={[
                {
                  id: 1,
                  label: 'Mark as Completed',
                  isLocked: false,
                  onPress: () => {
                    this.closeActionSheet();
                    this.setState({showCompleteConfirmModal: true});
                  }
                },
                {
                  id: 2,
                  label: 'Swap Activity',
                  isLocked: false,
                  onPress: () => {
                    this.closeActionSheet();
                  }
                },
                {
                  id: 3,
                  label: 'Set Reminder',
                  isLocked: !this.state.isPro,
                  onPress: () => {
                    this.closeActionSheet();
                    if (!this.state.isPro) this.props.navigation.navigate("Payment");
                  }
                }
              ]}
              onCancel={this.closeActionSheet} />
        </Modal>
    );
  }

  /**
   * render activity complete confirm modal
   */
  renderCompleteConfirmModal() {
    return(
        <Modal
            isVisible={this.state.showCompleteConfirmModal}
            backdropColor="#666666"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}>
          <View style={activityStyle.accdContainer}>
            <Text style={activityStyle.accdTitle}>Are you sure you want to mark the activity as complete?</Text>
            <Text style={activityStyle.accdDesc}>Once marked as completed this can not be undone.</Text>
            <TouchableOpacity style={activityStyle.accdButton} onPress={() => {
              this.closeCompleteConfirmDialog();
              this.markActivityCompleted();
            }}>
              <Text>Mark As Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={activityStyle.accdButton} onPress={this.closeCompleteConfirmDialog}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
    );
  }

  render() {
    if(this.state.carouselItems.length > 0) {
      return(
        <View style={{flex: 1}}>
          <Carousel
            layout={"default"}
            ref={(c) => { this.state.carouselRef = c; }}
            data={this.state.carouselItems}
            sliderWidth={this.state.width}
            itemWidth={this.state.width}
            renderItem={this._renderItem}
            onSnapToItem = { (index) => this.setState({activeIndex: index}) }
            useScrollView={true}
            />

            {/* If there is only one item then add a buffer instead of the pagination */}
            { this.state.carouselItems.length < 2 ?
              <View style={{height: 25}} />
              :
              this.pagination
            }

          {/* if not completed activity, show menu items; 1 - Mark as Completed, 2 - Swap Activity, 3 - Set Reminder */}
          { !this.state.carouselItems[0].complete &&
          <TouchableOpacity style={activityStyle.menu} onPress={() => this.setState({showActionSheet: true})}>
            <Icon name={"ellipsis-v"}
                  type="font-awesome-5"
                  size={16}
                  color={"black"}
            />
          </TouchableOpacity> }

          {/* render menu */}
          {this.renderMenu()}

          {/* render activity complete confirm modal */}
          {this.renderCompleteConfirmModal()}
        </View>
      )
    } else {
      return( <View style={[activityStyle.fragmentBox, {height: 120, marginBottom: 40}]} >
        <View style={{width: "90%", height: "100%", justifyContent: "center", backgroundColor: "#F2F2F2"}}>
            <Text style={[appStyle.H4, {textAlign: "center"}]}>There is nothing to display today.</Text>
          </View>
        </View>
         );
      }
  }
}

/**
 * A modal which displays a summary of the selected activity an an option to
 * Start the activity.
 *
 * Accepts a prop containing:
 * activityModal - the current activity data to display
 * activityRef - a reference to the individual slot and activity of the
 *   form {slot: slot index, index: activity index}
 * showModal - callback function to show/hide the modal
 * navigation - the navigation prop
 * today - the full day data OR 'null' to indicate that this is a saved activity only
 * (optional) displayOnly - If this is a saved activity or toolkit item and should not allow completing or saving
 *
 */
export class ActivityModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisActivity: this.props.activityModal, //The activity data
      displayOnly: this.props.displayOnly ? this.props.displayOnly : false, //A flag for if this activity is to be completed, or jsut displyed like a saved activity
      smallActivity: false, //A small activity only shows this modal and a "complete" button, otherwise it will go to the main activity page
      activitySaved: false, //Is this activity saved or not
      uriPrefix: null, //The URI for the cloud services / CDN
      isActivityLiked: false, //Like state of the activity
      isActivityComplete: false, //completed state of the activity
      OS: Platform.OS, //The current OS
      height: Dimensions.get("window").height, //Screen height
    }
  }

  componentDidMount() {
    //Determine if this is a small activity or not
    //A "small" activity has < 100 charactesrs text, no video, and only one task
    //First check if there are any tasks at all
    if(this.state.thisActivity.tasks) {
      if(this.state.thisActivity.tasks.length == 0) {
        this.setState({smallActivity: true});
      }
    } else {
      this.setState({smallActivity: true});
    }

    //Get URI for cloud service
    getURIPrefix().then((prefix) => this.setState({uriPrefix: prefix}));

    console.log("activity data:", this.state.thisActivity);

    //Get the saved state of this activity
    isActivitySaved(this.state.thisActivity).then((result) => this.setState({activitySaved: result}));

    //Get the liked state
    isActivityLiked(this.state.thisActivity).then((result) => this.setState({isActivityLiked: result}));
  }


  /**
   * Logic when a daily is activity is completed. Marks it as complete,
   * and then shows the "activity complete" modal.
   */
  completeActivity() {
    //If this activity is for display only then don't complete, just exit
    if(!this.state.displayOnly) {
      this.setState({isActivityComplete: true});
      //Save the completed activity
      completeActivity(this.state.thisActivity.day_of_program, this.props.activityRef);
    } else {
      this.setState({isActivityCompleted: false});
      this.props.hideModal(true);
    }
  }

  /**
   * Save activity callback function
   */
  saveActivity(state) {
    //Update the graphic state
    this.setState({activitySaved: state});

    //Delete or add the item appropriately
    if(state) {
      setSavedActivity(this.state.thisActivity);
    } else {
      deleteSavedActivity(this.state.thisActivity);
    }
  }

  /**
   * Likes the current activity
   */
  likeThisActivity() {
    //Like / unlikes the activity
    likeActivity(this.state.thisActivity);
    this.setState({isActivityLiked: !this.state.isActivityLiked});
  }

  /**
   * Clears all the current modals (ActivityModal and ActivityCompleteModal)
   */
  clearModals(){
    this.setState({isActivityCompleted: false});
    this.props.hideModal(true);
    this.props.forceRefresh();
  }


  render() {
    //Determine the image to display. Start with a backup image, and then load the specified image
    let thisImage = activityImage;
    let authorImage = null;
    let imageURI = null;
    //When the full URL is available, then reference the remote image
    if(this.state.uriPrefix) {
      if(this.state.thisActivity.activity_image) {
        imageURI = {uri: this.state.uriPrefix + this.state.thisActivity.activity_image};
        if(this.state.thisActivity.author_image) {
          authorImage = {uri: this.state.uriPrefix + this.state.thisActivity.author_image};
        }
      }
    }

    //The HTML object for the webview
    let webViewStyle = "<style> p {  } </style>";
    const activityDescription = this.state.thisActivity.activity_blurb;

    return (

      <SafeAreaView style={{flex: 1}}>
        <Overlay isVisible={this.props.showModal}
          overlayStyle={activityStyle.modalBox}
          >
            <View style={{height: "100%"}}>
              {/* Back button */}
              <View style={[activityStyle.modalCloseBox, this.state.OS == 'ios' ? {top: 20} : null]}>
                <Icon name={"angle-left"}
                  type="font-awesome" size={60}
                  onPress={() => this.props.hideModal(true)}
                />
              </View>

              <ScrollView>
                {/* Main view */}
                <View style={[appStyle.bodyBox, {minHeight: this.state.height - 30}]}>

                  <View style={activityStyle.modalActivityBox}>
                    <ImageBackground source={imageURI ? imageURI : thisImage} style={activityStyle.modalImage} />
                  </View>


                  <View style={activityStyle.modalBodyBox}>
                    {/* Category and like / save icons */}
                    <View style={activityStyle.modalCategoryBox}>
                      <View style={{flex: 1}}>
                        <Text style={[appStyle.H4, {fontSize: 14}]}>{getActivityFocusString(this.state.thisActivity)}</Text>
                      </View>

                      <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                        {/* The SAVE and LIKE icons */}
                        {/* LIKE icon */}
                        <TouchableOpacity style={activityStyle.iconBox}
                          onPress={() => this.likeThisActivity()}
                        >
                          <Image source={this.state.isActivityLiked ? heartIconFilled : heartIcon} style={activityStyle.modalIconImage} />
                        </TouchableOpacity>

                        {/* SAVE icon */}
                        <TouchableOpacity style={activityStyle.iconBox}
                          onPress={() => this.saveActivity(!this.state.activitySaved)}
                        >
                          <Image source={this.state.activitySaved ? flagIconFilled : flagIcon} style={activityStyle.modalIconImage} />
                        </TouchableOpacity>
                      </View>

                    </View>

                    {/* Title */}
                    <Text style={[appStyle.H3, {textAlign: "left", paddingTop: 10, fontWeight: "bold", fontSize: 18}]}>{this.state.thisActivity.activity_title}</Text>

                    {/* Bio and profile pic of the activity creator */}
                    <View style={activityStyle.modalProfileBox}>
                      <Image style={activityStyle.modalProfileImage} source={authorImage ? authorImage : activityImage} />
                      <Text style={appStyle.H4}>{this.state.thisActivity.author_name ? this.state.thisActivity.author_name : "---"}</Text>
                    </View>
                    <View>
                      <Text style={[appStyle.H4, {marginTop: 10, marginBottom: 10, marginLeft: 0, fontWeight: "bold", fontSize: 14}]}>{this.state.thisActivity.activity_info_text_1} | {this.state.thisActivity.activity_info_text_2} | {this.state.thisActivity.activity_info_text_3}</Text>
                    </View>

                    {/* Description details of the activity */}

                    <HTML
                      source={{html: webViewStyle + activityDescription}}
                      containerStyle={activityStyle.modalWebView}
                    />

                  </View>

                  {/* Button to begin the activity */}
                  <View style={activityStyle.modalBottomBox}>

                    {/* This button will either go to the full activity (if there is video content), or complete the activity (for small activities) */}
                    {
                      this.state.smallActivity ?
                        <TouchableOpacity style={appStyle.defaultButton}
                          onPress={() => this.completeActivity()} >
                          {/* If this is a display ONLY activity then show "done" text, otherwise show "complete" text */}
                          <Text style={appStyle.buttonText}>{this.state.displayOnly ? "Done!" : "Mark As Complete"}</Text>
                        </TouchableOpacity>
                      :
                        <TouchableOpacity style={appStyle.defaultButton}
                          onPress={() => {
                            this.props.navigation.navigate("Activity", {
                                activity: this.state.thisActivity,
                                today: this.props.today,
                                activityRef: this.props.activityRef,
                                displayOnly: this.state.displayOnly});
                            this.props.hideModal(true);
                          }
                        } >
                          <Text style={appStyle.buttonText}>LET'S GO</Text>
                        </TouchableOpacity>
                    }
                  </View>
                </View>


                {/* The modal to display when an activity is complete */}
                <ActivityCompleteModal showModal={this.state.isActivityComplete}
                  clearModal={(complete) => this.clearModals()}
                  today={this.props.today}
                  activity={this.state.thisActivity}
                  activityRef={this.props.activityRef}
                  saveActivity={(save) => this.saveActivity(save)}
                  activitySaved={this.state.activitySaved}
                />

              </ScrollView>
            </View>
        </Overlay>
      </SafeAreaView>
    );
  }
}