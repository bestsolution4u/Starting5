import { StyleSheet } from 'react-native';
import { getColour } from "../controllers/helperFunctions";

export default StyleSheet.create({
    fullBox: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'white',
    },
    mainBox: {
        flex: 1, 
        width: "100%",
        alignItems: 'flex-start', 
        justifyContent: 'flex-start', 
        backgroundColor: 'white',
    },
    bodyBox: {
      flex: 1, 
      width: "100%", 
      height: "100%",
      alignItems: "center",
      alignContent: "center",
    },
    container: {
      flex: 1,
      padding: 24,
      alignItems: "center"
    },
    myText: {
      color: "#000",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "left"
    },
    circleIcon: {
      width: 30,
      height: 30,
      borderWidth: 2,
      borderColor: "black",
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 2,
      marginRight: 2,
    },
    H1: {
      color: "black",
      fontSize: 32,
      fontFamily: "NotoSansKR-Medium",
      lineHeight: 38,
    },
    H2: {
      fontSize: 24,
      fontFamily: "MonumentExtended-Regular",
      lineHeight: 26,
    },
    H3: {
      fontSize: 20,
      fontFamily: "NotoSansKR-Bold",
      lineHeight: 24,
    },
    H4: {
      fontSize: 16,
      fontFamily: "NotoSansKR-Light",
      lineHeight: 24,
    },
    H5: {
      fontSize: 10,
      fontFamily: "NotoSansKR-Light",
      lineHeight: 18,
    },
    H6: {
      fontSize: 8,
      fontFamily: "NotoSansKR-Light",
      lineHeight: 12,
    },
    headerText: {
      fontSize: 16,
      fontFamily: "MonumentExtended-Regular",
    },
    bodyColour: {
        backgroundColor: getColour("body"),
    },
    bodyFontColour: {
        color: getColour("body"),
    },
    mindColour: {
        backgroundColor: getColour("mind"),
    },
    mindFontColour: {
        color: getColour("mind"),
    },
    communityColour: {
        backgroundColor: getColour("community"),
    },
    communityFontColour: {
        color: getColour("community"),
    },
    foodColour: {
        backgroundColor: getColour("food"),
    },
    foodFontColour: {
        color: getColour("food"),
    },
    s5SkillsColour: {
        backgroundColor: getColour("s5skills"),
    },
    s5SkillsFontColour: {
        color: getColour("s5skills"),
    },
    greenColour: {
        backgroundColor: getColour("green"),
    },
    greenFontColour: {
        color: getColour("green"),
    },
    pinkColour: {
        backgroundColor: getColour("pink"),
    },
    pinkFontColour: {
        color: getColour("pink"),
    },
    purpleColour: {
        backgroundColor: getColour("purple"),
    },
    purpleFontColour: {
        color: getColour("purple"),
    },
    blueColour: {
        backgroundColor: getColour("blue"),
    },
    blueFontColour: {
        color: getColour("blue"),
    },
    orangeColour: {
        backgroundColor: getColour("orange"),
    },
    orangeFontColour: {
        color: getColour("orange"),
    },
    greyColour: {
      backgroundColor: "#F2F2F2"
    },
    s5BlackColour: {
      backgroundColor: "#231F20",
    },
    defaultButton: {
        backgroundColor: getColour("green"),
        borderRadius: 8,
        justifyContent: "center",
        width: "100%",
        height: 50,
        marginBottom: 20,
        borderRadius: 5,
        alignItems: "center",
    },
    defaultTransparentButton: {
      borderRadius: 8,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "black",
      width: "100%",
      height: 50,
      marginBottom: 20,
      borderRadius: 5,
      justifyContent: "center",
    },
    defaultWhiteButton: {
      borderRadius: 8,
      justifyContent: "center",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "black",
      width: "100%",
      height: 50,
      marginBottom: 20,
      borderRadius: 5,
      justifyContent: "center",
    },
    buttonText: {
        textAlign: "center",
        color: "#000000",
        fontWeight: "normal",
        fontFamily: "NotoSansKR-Regular",
        fontSize: 18
    },
    secondaryButton: {
        borderRadius: 8,
        justifyContent: "center",
        width: "100%",
        height: 50,
        marginBottom: 20,
        borderRadius: 5,
        justifyContent: "center",
    },
    secondaryButtonText: {
        textAlign: "center",
        color: getColour("green"),
        fontFamily: "NotoSansKR-Bold",
        fontSize: 16
    },
    contentBox: {
      padding: 0,
      marginBottom: 20,
      backgroundColor: "#F2F2F2",
      borderRadius:10,
      borderWidth: 2,
      borderColor: '#BFBFBF'
    },
    headingBox: {
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 20,
      backgroundColor: "#F2F2F2",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "lightgray",
    },
    hBarBox: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    hLine: {
        width: "80%", 
        backgroundColor: "#C0C0C0", 
        height: 5,
    },
    cardHeading: {
      fontSize: 18,
      height: 25,
      margin: 0,
      padding: 0,
    },
    compactCard: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 10,
      paddingTop: 5,
      shadowOpacity: 0.5,
      shadowOffset: {width: 5, height: 5 },
      shadowColor: 'black',
      shadowRadius: 5,
      elevation: 5,
      borderRadius: 10,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
      },
    activityIndicatorWrapper: {
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    errorModalBox: {
        backgroundColor: '#FFFFFF',
        height: 200,
        width: "80%",
        display: 'flex',
        alignItems: 'center',
        alignContent: "center",
        justifyContent: 'space-around',
        padding: 10,
        alignContent: "center",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 4,
    },
    fullScreenScroll: {
      flex: 1,
      width: "100%",
    },
    shadow: {
      shadowOpacity: 0.5,
      shadowRadius: 5,
      shadowOffset: {width: 5, height: 5 },
      shadowColor: 'black',
      elevation: 5,
    },
    textInput: {
        backgroundColor: "white",
        height: 40,
        width: "70%",
        marginLeft: 20,
    },
  });