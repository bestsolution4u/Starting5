import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backgroundImage: {
      flex: 1,
      margin: 0,
      padding: 0,
      width: "80%",
      resizeMode: "contain",
    },
    iconImage: {
      margin: 0,
      padding: 0,
      width: "100%",
      height: "80%",
      resizeMode: "contain",
    },
    iconBox: {
      padding: 0,
      margin: 0,
      flex: 1,
      width: "100%",
    },
    iconTouchable: {
      flex: 1, 
      paddingTop: 5, 
      width: "100%"
    },
    centreImage: {
      width: "60%",
      resizeMode: "contain",
      tintColor: "black",
    },

    //Styles for the drawer menu
    drawerMenu: {
      backgroundColor: "black",
    },
    drawerH2: {
      fontSize: 20,
    }
});