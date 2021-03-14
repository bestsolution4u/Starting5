/**
 * Starting5 React native app
 *
 */

import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Database functions
import { doLogOut, getUserData } from "./controllers/localDB";

//the various screen files
import {LandingScreen} from "./screens/landingScreen";
import {SurveyScreen} from "./screens/surveyScreen";
import {PreSurveyScreen} from "./screens/preSurveyScreen";
import {HomeScreen} from "./screens/homeScreen";
import {ProgressScreen} from "./screens/progressScreen";
import {SavesScreen} from "./screens/savesScreen";
import {ActivityScreen} from "./screens/activityScreen";
import {ProfileScreen} from "./screens/profileScreen";
import {ContactScreen} from "./screens/contactScreen";
import {AboutScreen} from "./screens/aboutScreen";
import {ToolkitScreen} from "./screens/toolkitScreen";
import {DeveloperScreen} from "./screens/developerScreen";
import {LoginScreen} from "./screens/loginScreen";
import {SettingsScreen} from "./screens/settingsScreen";
import {PaymentScreen} from "./screens/paymentScreen";

//Tab Bar
import {BottomNavBar} from "./screens/bottomNavBar";

//The three navigations stacks that we will use
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//Any styles needed
import headerStyle from "./styles/headerStyle";
import appStyle from './styles/appStyle';

/**
 * This is the tabbed navigator for the HOME screen and most of the app.
 */
function HomeTabs(props) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      tabBar={props => <BottomNavBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Toolkit" component={ToolkitScreen} />
      <Tab.Screen name="Saves" component={SavesScreen}  />
    </Tab.Navigator>
  );
}

/**
 * Side navigation drawer
 */
const DrawerNavigator = (props) => {
  return (
    <Drawer.Navigator
      drawerStyle={headerStyle.drawerMenu}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "white",
        labelStyle: appStyle.H3,
      }}
    >
      <Drawer.Screen name="HOME" component={HomeTabs}/>
      <Drawer.Screen name="MY ACCOUNT" component={SettingsScreen} />
      <Drawer.Screen name="ABOUT US" component={AboutScreen} />
      {props.route.params.isDeveloper ?
        <Drawer.Screen name="DEVELOPER PANEL" component={DeveloperScreen} />
      :
        null
      }
    </Drawer.Navigator>
  )
}

/**
 * Navigation for the landing screens only, when user is nots logged in
 * @param {isLoggedIn} props 
 */
const LandingScreens = (props) => {
  return (
      <Stack.Navigator initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
      }}>
        <Stack.Screen name="Landing" component={LandingScreen} 
          initialParams={{isLoggedIn: props.isLoggedIn, setLogin: props.setLogin}} 
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Survey" component={SurveyScreen} 
          initialParams={{isLoggedIn: props.isLoggedIn, setLogin: props.setLogin}} />
        <Stack.Screen name="PreSurvey" component={PreSurveyScreen} />
      </Stack.Navigator>
  )
}

const MainScreens = (props) => {
  return(
    <Stack.Navigator initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
    }}>
      <Stack.Screen name="HomeTabs" component={DrawerNavigator} 
      initialParams={{setLogin: props.setLogin, isLoggedIn: props.isLoggedIn, isDeveloper: props.isDeveloper}} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="LOG OUT" component={LandingScreen} initialParams={{setLogin: props.setLogin}} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  )
}



/**
 * Entry point for the application. This should only set up the navigation
 * Screens available to the whole app.
 * Landing Screen | Home Screen | Survey Screen
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false, //Login state of the app
      userData: null,
      isDeveloper: true, //Developer flag
    };
  }

  componentDidMount() {
    //Check the locally stored login state
    getUserData().then((result) => {
      if(result) {
        console.log("Login State: ", result);
        //If this is a developer user then set the isDeveloper flag
        let developerFlag = true;
        if(result.user_credential.user_id) {
          //Temporary measure, anybody with user_id < 10 is a developer
          if(result.user_credential.user_id < 10) {
            console.log("DEVELOPER MODE with user_id:", result.user_credential.user_id);
            developerFlag = true;
          }
        }
        this.setState({isLoggedIn: result.isLoggedIn, userData: result, isDeveloper: developerFlag}, SplashScreen.hide());
      } else {
        this.setState({isLoggedIn: false}, SplashScreen.hide());
      }

      
    });
  }

  
  render() {
    return (
      <NavigationContainer>
        {this.state.isLoggedIn ? 
          <MainScreens isLoggedIn={this.state.isLoggedIn} setLogin={(state) => this.setState({isLoggedIn: state})} isDeveloper={this.state.isDeveloper} />
        :
          <LandingScreens isLoggedIn={this.state.isLoggedIn} setLogin={(state) => this.setState({isLoggedIn: state})} />
        }
      </NavigationContainer>
    );
  }
}

export default App;
