import React from 'react';
import { Dimensions } from 'react-native';
import { View, Text, Image, ScrollView, YellowBox, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import { Card , Button, Icon, Overlay } from 'react-native-elements';

import { setSurveyResponse } from "../controllers/remoteDB";
import { saveSurveyResponse } from "../controllers/localDB";
import { LoadingModal, ErrorModal } from "../controllers/helperFunctions";
import { finaliseLogin } from "../controllers/firebaseFunctions";

//Styles
import appStyle from "../styles/appStyle";
import surveyStyle from "../styles/surveyStyle";

//Assets
const starting5 = require('../assets/starting-5.png');
const s5Logo = require('../assets/logo.png');
const background1 = require("../assets/images/oliver-dark.jpg");
const background2 = require("../assets/images/david-lariviere-dark.jpg");
const background3 = require("../assets/images/jason-briscoe-dark.jpg");
const background4 = require("../assets/images/lyfe-fuel-dark.jpg");
const backgrounds = [background1, background2, background3, background4];
const titleImage = require("../assets/title-image.png");
const curvedArrow = require("../assets/curved-arrow.png");

//hard coded survey questions
const surveyQuestions = [
  {id: 0, question: "S5 is all about setting realistic, achievable goals that fit into your day.\nHow much time can you allocate?", num_answers: 1,
    answers:[{id: 0, label: "20 minutes / day"}, {id: 1, label: "40 minutes / day"}, {id: 2, label: "60 minutes / day"}, {id: 3, label: "60+ minutes / day"}]},
  {id: 1, question: "What's your gender?", num_answers: 1,
    answers: [{id: 0, label: "Male"}, {id: 1, label: "Female"}, {id: 2, label: "Non-Binary"}]},
  {id: 2, question: "Age", num_answers: 1,
    answers: [{id: 0, label: "16 to 24"}, {id: 1, label: "25 to 34"}, {id: 2, label: "35 to 44"}, {id: 3, label: "45 to 54"}, {id: 4, label: "55 to 64"}, {id: 5, label: "65 to 74"}]},
  {id: 3, question: "How many days do you work out per week?", num_answers: 1,
    answers: [{id: 0, label: "I almost never work out"}, {id: 1, label: "I work out once a week"}, {id: 2, label: "I work out two times a week"}, {id: 3, label: "I work out 3 or 4 times a week"}, {id: 4, label: "I work out five times a week or more"} ]},
  {id: 4, question: "Pick 3 body and mind goals", num_answers: 3,
    answers: [{id: 0, label: "HIIT"}, {id: 1, label: "Strength"}, {id: 2, label: "Yoga"}, {id: 3, label: "Meditation"}, {id: 4, label: "Breath Work"}, {id: 5, label: "Movement"}, {id: 6, label: "Flexibility and Mobility"}]},
  {id: 5, question: "Pick two habbits you are interested in building", num_answers: 2,
    answers: [{id: 0, label: "Self-Care"}, {id: 1, label: "Self-Love"}, {id: 2, label: "Environmental"}, {id: 3, label: "Connection"}]},
];

/**
 * A modal that warns the user if they haven't selected enough answers to a survey.
 */
const SurveyWarningModal = (props) => {
  return(
    <Overlay isVisible={props.show}
      overlayStyle={appStyle.errorModalBox}
      >
      <View>
      <Text style={[appStyle.H3, {textAlign: "center"}]}>Please select {props.numAnswers} items.</Text>
      <TouchableOpacity style={appStyle.secondaryButton}
        onPress={() => props.close()} >
          <Text style={[appStyle.secondaryButtonText]}>OK</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  )
}

/**
 * The prototype survey question accepts a QUESTION json with "question" and "answers[]" fields.
 * Displays the question as a heading and a button for each answer.
 */
export class SurveyQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [], //List of answers provided
      warningModal: false, //Show the "not enough answers" warning.
  }};

  /**
   * Flips the state of the selected answer.
   * May need other logic to see how many buttons are pressed.
   * @param int index 
   */
  pressAnswer(index) {
    let newAnswers = this.state.answers;
    //Check if answer is already in the list and remove it
    let found = false;
    for(let i = 0; i < newAnswers.length; i++) {
      if(newAnswers[i] == this.props.thisQuestion.answers[index].id) {
        newAnswers.splice(i, 1);
        found = true;
        break;
      }
    }

    //If nothing was found then add it to the list
    if(!found) {
      //IF we have not reached the maximum answer count
      if(newAnswers.length < this.props.thisQuestion.num_answers) {
        newAnswers.push(this.props.thisQuestion.answers[index].id);
      }
    }

    this.setState({answers: newAnswers}, () => console.log("answer list:", this.state.answers));
  }

  /**
   * Checks if the provided answer is in the slected answers list
   * @param {*} answer 
   */
  isSelected(answer) {
    for(let i = 0; i < this.state.answers.length; i++) {
      if(this.state.answers[i] == answer.id) {
        return true;
      }
    }

    return false;
  }

  /**
   * Finalise the answer and progress to the next one
   */
  saveAnswer() {
    //If not enough answers were selected then show a warning
    if(this.state.answers.length == this.props.thisQuestion.num_answers) {
      //This is so hacky, but because it's two seperate classes with states, rather than functions
      //like a sane person, we clear the saved state now.
      //THEN Send the results to the parent function and advance to the next question.
      this.props.recordAnswer({question_id: this.props.thisQuestion.id, answers: this.state.answers});
      this.setState({answers: []});
    } else {
      //Show the not enough answers modal
      this.setState({warningModal: true});
    }

  }

  render() {
    return (
      <View style={surveyStyle.questionCard}> 

      {/* The warning to users if they haven't answered enough questions */}
      <SurveyWarningModal show={this.state.warningModal} 
        numAnswers={this.props.thisQuestion.num_answers}
        close={() => this.setState({warningModal: false})} />

      <Text style={[appStyle.H3, {marginLeft: 5, marginRight: 5, textAlign: "center", marginBottom: 20, fontFamily: "NotoSansKR-Regular",}]}>{this.props.thisQuestion.question} </Text>
        {
          this.props.thisQuestion.answers.map((answer, index) => {
            //For each answer we build a button for which returns to the getAnswer() callback function
            return (
              <TouchableOpacity 
                key={index}
                style={[appStyle.defaultTransparentButton, {width: "100%"}, this.isSelected(answer) ? {backgroundColor: "#CCCCCC"} : null]}
                onPress={() => this.pressAnswer(index)}
                >
                <Text style={appStyle.buttonText}>{answer.label}</Text>
              </TouchableOpacity>
            );
          })
        }
        <TouchableOpacity style={[appStyle.defaultButton, {width: "100%"}]}
          onPress={() => this.saveAnswer()}
        >
          <Text style={appStyle.buttonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


/**
 * Provides a framework for displaying the various survey questions and
 * taking responses. Each question is displayed in a box, and the next
 * questions takes its place once an answer is given. There should also
 * be animations.
 */
export class SurveyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getAnswer: null,
      allAnswers: [],
      questionCount: 0,
      finishedQuestions: false,
      doSignup: false,
      surveyComplete: false,
      totalQuestions: 0,
      height: Dimensions.get("window").height,
      userData: this.props.route.params.userData, //Any user data supplied through the sign-up process
      isLoading: false, //Loading icon
      error: null, //Error box
    };
  }

  /**
   * Initial load when the screen loads but before anything is displayed
   */
  componentDidMount() {

    //Calculate the total number of questions for the percentage complete bar
    this.setState({totalQuestions: surveyQuestions.length});
  }

  /**
   * Logic to check state changes and progress to the next screen, or not,
   * you know do what you like.
   */
  componentDidUpdate() {
    //if the signup button was pressed (via callback) then do something
    if(this.state.doSignup) {
      //Hide the survey complete modal
      this.setState({surveyComplete: false, doSignup: false});
      //Go to the HOME screen
      this.props.navigation.navigate("Landing");
    }
  }

  /**
   * Record the answers provided for this question and advances to the next question.
   * @param [id] answers 
   */
  recordAnswer(answers) {
    let newAnswers = this.state.allAnswers;
    newAnswers.push(answers);
    //If this is not the last question then progress, otherwise finish
    if(this.state.questionCount < this.state.totalQuestions - 1) {
      this.setState({questionCount: this.state.questionCount + 1, allAnswers: newAnswers});
    } else {
      console.log("final survey results:", this.state.allAnswers);
      //Save the response
      saveSurveyResponse(this.state.allAnswers).then(() => this.setState({surveyComplete: true}));
    }
  }

  /**
   * Once user data has been checked, this function prepares the screens and
   * local database to display the program data.
   * @param {*} userData 
   */
    completeLogin(userData) {
      //Start the process
      this.setState({isLoading: true});

      //First save a (currently dummy) survey to generate a program
      setSurveyResponse(userData).then((surveyResponse) => {
        finaliseLogin(userData).then((success) => {
          if(success) {
            if(success.success) {
              //Login was successful
              this.setState({isLoading: false});
              this.props.route.params.setLogin(true);
            } else {
              //Login was successful but there was a problem with the account
              this.setState({isLoading: false, error: "There seems to have been a problem setting up the account. Please try again later."});
              //Complete account setup by going to the survey page
              this.props.navigation.navigate("PreSurvey", {userData: userData});
            }
          } else {
            //Login was NOT successful
            this.setState({isLoading: false, error: "Incorrect username or password."});
          }
        }).catch((err) => this.setState({isLoading: false, error: err.toString()}));
      }).catch((err) => this.setState({isLoading: false, error: "Error communicating with server: " + err}));
  }

  /**
 * An overlay which displays when the user has completed the survey with a congratulatory
 * message, and a prompt to continue to sign up.
 */
  surveyCompleteView() {
    const text = "Your profile is complete!\n\nYour personalised plan is being curated by our team of industry professionals.\n\nYour daily activities will be revealed one day at a time.";
    
    return (
      <View style={[surveyStyle.questionCard]}>
          
        <View style={[{alignItems: "flex-start", minHeight: this.state.height - surveyStyle.headerBox.height - 230}]}>
          <Text style={[appStyle.H4, {textAlign: "center", fontSize: 20, lineHeight: 24, fontWeight: "bold"}]}>{text}</Text>
        </View>

        <View style={{justifyContent: "flex-end"}}>
          <Text style={[appStyle.H3, {textAlign: "center"}]}>Todays Ready For You</Text>

          <View style={{width: "100%", alignItems: "flex-end", left: -20}}>
            <Image source={curvedArrow}/>
          </View>

          <TouchableOpacity style={[appStyle.defaultButton, {width: "100%", marginTop: 0}]}
            onPress={() => this.completeLogin(this.state.userData)} >
            <Text style={appStyle.buttonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }

  render() {
  //We create a SurveyQuestion for each survey question with a callback function to privde the answer.
  //Answers are returned in the format {question_id, answer_id}
  //When a question is answered, it is removed from the display and the next question is rendered

  //Calculate the background to display from the list of available background images
  const thisBackground = backgrounds[this.state.questionCount % backgrounds.length];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{backgroundColor: "white"}}>
        <View style={[appStyle.bodyBox]}>

          {/* Loading box */}
          <LoadingModal isLoading={this.state.isLoading} />

          {/* The error modal */}
          <ErrorModal showError={this.state.error ? true : false}
            error={this.state.error}
            dismissError={() => this.setState({error: null})}
          />

          {/* The banner image */}
          <ImageBackground source={thisBackground} style={surveyStyle.headerBox}>
              <View style={surveyStyle.headerBottomBox}>
                {/* Only show the left arrow / previous question icon if this is NOT the first question */}
                {
                  this.state.questionCount > 0 ?
                  <TouchableOpacity
                      style={{width: 60, height: 60}}
                      onPress={() => this.setState({questionCount: this.state.questionCount - 1})} 
                    >
                    <Icon name={"angle-left"} 
                      type="font-awesome" size={60} 
                      iconStyle={{color: "white"}} 
                    />
                  </TouchableOpacity>
                  :
                    <View style={{width: 60, height: 60}} />
                }
                <Text style={[appStyle.H3, {color: "white", width: "90%", textAlign: "center", left: -30}]}>Step {this.state.questionCount + 1} / {this.state.totalQuestions}</Text>
              </View>
          </ImageBackground>

          {/*Main body of the survey screen */}
          <View style={surveyStyle.bodyBox}>
            {/* Either display the current question, or display the completed survey Overlay / dialog if finishedQuestions */}
            {this.state.surveyComplete ?
              this.surveyCompleteView()
            :
              <SurveyQuestion thisQuestion={surveyQuestions[this.state.questionCount]} recordAnswer={(answers) => this.recordAnswer(answers)} />
            }
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
  }
}