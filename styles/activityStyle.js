import { StyleSheet } from 'react-native';
import { getColour } from '../controllers/helperFunctions';

import appStyle from "./appStyle";

export default StyleSheet.create({
    fragmentBox: {
        flex: 1,
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        flexDirection: "row",
        width: "90%",
        height: 120,
        padding: 0,
        marginLeft: 20,
        marginBottom: 12,
    },
    activityImage: {
      margin: 5,
      height: 120,
      width: 150,
      resizeMode: "cover",
      backgroundColor: "gray",
      borderRadius: 6,
    },
    H1: {
      color: "#333355",
      fontSize: 18,
      fontFamily: "NotoSansKR-Light",
    },
    H2: {
      color: "#333355",
      fontSize: 12,
      fontFamily: "NotoSansKR-Light",
    },
    textInput: {
      width: "80%", 
      height: 60, 
      marginLeft: 20, 
      borderBottomWidth: 1, 
      borderColor: "lightgray",
    },
    textOverlayBox: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      paddingLeft: 10,
      alignContent: "flex-start",
      height: "100%",
      flexWrap: "wrap",
    },
    sideBarBox: {
        flex: 1,
        flexDirection: "column",
    },
    iconImage: {
        flex: 1,
        height: 24,
        width: 24,
        resizeMode: "contain",
        paddingBottom: 10,
    },
    innerIcon: {
        marginTop: -8,
    },
    button: {
      flex: 1,
      borderRadius: 2,
      borderColor: appStyle.greenColour.backgroundColor,
      borderRadius: 25,
      height: 50,
      width: 50,
      justifyContent: "center",
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 24
    },

    //Activity Modal
    modalBox: { 
      flex: 1,
      width: "100%",
      height: "99%",
      padding: 0,
    },
    modalCloseBox: {
      zIndex: 999,
      alignSelf: "flex-start",
      position: "absolute",
      marginLeft: 10,
    },
    modalCloseImage: {
      height: 40,
      width: 40,
    },
    modalActivityBox: {
      width: "100%",
      alignSelf: "center",
    },
    modalImage: {
      width: "100%",
      height: 250,
      resizeMode: "contain",
    },
    modalListItem: {
      flexDirection: "row",
      paddingBottom: 10,
    },
    modalBodyBox: {
      flex: 1,
      width: "100%",
      paddingTop: 10,
      padding: 10,
      marginLeft: 20,
      marginRight: 20,
    },
    modalCategoryBox: {
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
    },
    modalIconImage: {
      width: 30,
      height: 30,
      marginLeft: 10,
      tintColor: getColour("green"),
    },
    modalBottomBox: {
      width: "100%", 
      alignSelf: "flex-end",
      justifyContent: "flex-end",
      padding: 10,
      paddingBottom: 0,
    },
    modalProfileBox: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    modalProfileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 10,
    },
    modalWebView: {
      width: "100%",
      minHeight: 100,
      resizeMode: "cover",
      marginTop: -20,
    },

    //Activity Screen
    videoBox: {
      
    },
    videoOverlay: {
      width: "100%",
      zIndex: 900,
      position: "absolute",
      top: 0,
      left: 0,
      opacity: 0.67,
      backgroundColor: "black",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    mainBox: {
      padding: 10,
      alignItems: "center",
    },
    titleOverlay: {
      zIndex: 900,
      position: "absolute", 
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      top: 35,
    },
    headingText: {
      alignContent: "center",
    },
    watermarkText: {
      position: "absolute", 
      top: 30, 
      width: "100%", 
      textAlign: "center", 
      color: "white",
      fontWeight: "bold",
      textShadowRadius: 10,
      textShadowOffset: {width: 4, height: 4},
      textShadowColor: "#AAAAAA",
    },
    taskProgressBox: {
      height: 30,
      marginBottom: 20,
      marginTop: 10,
      justifyContent: "center",
    },
    taskProgressGraph: {
      width: "100%",
      height: 30,
      backgroundColor: "lightgray",
      borderRadius: 6,
      overflow: "hidden",
      position: "absolute"
    },
    taskProgressComplete: {
      backgroundColor: "black",
      height: 30,
    },
    mainImage: {
      width: "100%",
      height: 300,
    },
    mainImageBox: {
      backgroundColor: "pink",
      minHeight: 300,
    },
    videoButtons: {
      zIndex: 999,
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      position: "absolute",
      width: "100%",
      backgroundColor: "white",
      borderWidth: 0,
      borderColor: "black",
    },
    videoPlayImage: {
      width: 25,
      height: 25,
      top: 2,
      left: 1,
    },
    videoButton: {
      width: 35,
      height: 35,
      borderRadius: 20,
      borderWidth: 1,
    },
    videoProgressBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 15,
    },
    taskBox: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 10,
    },
    taskBoxWithVideo: {
      backgroundColor: "white",
    },
    taskImage: {
      width: 150,
      height: 150,
      resizeMode: "contain",
    },
    finalTaskBox: {
      alignItems: "center",
      justifyContent: "center",
      height: 150,
    },
    taskListItem: {
      borderRadius: 4,
      paddingLeft: 10,
      marginTop: 5,
      width: "80%",
      height: 30,
      justifyContent: "center",
    },
    taskBean: {
      height: 5,
      marginLeft: 5,
      marginRight: 5,
      backgroundColor: "gray",
    },
    taskBeansBox: {
      width: "80%", 
      flexDirection: "row",
      justifyContent: "center",
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
    bottomContentBox: {
      flex: 1,
      marginBottom: 20,
    },
    webView: {
      minHeight: 200,
      marginLeft: 20,
    },

    //Activity Complete Modal
    activityCompleteModalBox: {
      paddingLeft: 10,
      paddingRight: 10,
      width: "100%",
      height: "100%",
      backgroundColor: "black",
    },
    activityCompleteImageBox: {
      marginTop: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: 260,
      height: 260, 
      borderRadius: 130,
    },
    activityCompleteModalBody: {
      flexDirection: "row",
      marginTop: 20,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    activityCompleteItemCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    activityCompleteTextBox: {
      marginLeft: 10, 
      paddingLeft: 10,
      height: 30, 
      width: 200,
      borderRadius: 6,
      justifyContent: "center",
    },
    activityCompleteHeaderBox: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      marginTop: 30,
    },
    s5Complete: {
      width: 100,
      height: 100,
    },
    activityCompleteIconBox: {
      width: "100%",
      alignItems: "flex-end",
      top: -10,
      marginRight: 10,
    },
    saveActivityIcon: {
      width: 30,
      height: 30,
      tintColor: appStyle.greenColour.backgroundColor,
    },
    activityCompleteIcon: {
      width: 50,
      height: 50,
      tintColor: "white",
    },
    progressCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 6,
        borderColor: "gray",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 5,
        marginRight: 5,
        overflow: "visible",
        alignSelf: "center",
    },

    //Warning Modal
    warningModalBox: {

      paddingLeft: 10,
      paddingRight: 10,
      width: "80%",
      backgroundColor: "black",
      borderRadius: 2,
    },

    //Rest Modal
    restModalBox: {
      paddingLeft: 10,
      paddingRight: 10,
      alignContent: "center",
      width: "100%",
      height: "100%",
      backgroundColor: appStyle.greenColour.backgroundColor,
    },

    // menu
    menu: {
        position: 'absolute',
        right: 16,
        top: 0,
        paddingHorizontal: 6,
        paddingVertical: 2
    },

    // activity complete confirm dialog
    accdContainer: {
        backgroundColor: 'white',
        padding: 22,
        margin: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 4,
        borderColor: '#3465a4',
    },
    accdTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    accdDesc: {
        textAlign: 'center',
        marginTop: 15
    },
    accdButton: {
        width: '100%',
        height: 40,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#3465a4',
    }
});