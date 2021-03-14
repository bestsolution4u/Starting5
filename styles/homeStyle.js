/**
 * This is the default stylesheet for items that re-appear throuout the app.
 * For items that will only be used on a single screen, please make a
 * screen specific file.
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backgroundVideo: {
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        justifyContent: "flex-start",
        bottom: 0,
        right: 0
    },
    tasksBox: {
        paddingBottom:15,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#A9A9A9",
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#FF1010'
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    headerImage: {
        flex: 1,
        resizeMode: "contain",
        width: "100%",
        marginTop: 0,
        paddingTop: 0
    },
    elementBox: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
    },
    headingBox: {
        paddingLeft: 10, 
        paddingTop: 20, 
        alignItems: 'flex-start',
    },
    activityListBox: {
        width: "100%",
        marginTop: 20,
    },
    allActivitiesCompleteMessage: {
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        justifyContent: "center",
    },
    restDayBox: {
        width: "100%",
        backgroundColor: "black",
        height: "100%",
        alignItems: "center",
        marginTop: 50,
    },
    restDayImage: {
        width: 100,
        height: 100,
    },

    //Vertical line and tick boxes
    verticalLine: {
        width: 1,
        top: 30,
        marginLeft: 25,
        borderLeftWidth: 4,
        borderColor: "black",
    },
    tickCircle: {
        width: 30,
        height: 30,
        top: 0,
        left: 13,
        borderRadius: 15,
        borderWidth: 4,
        backgroundColor: "white",
        borderColor: "black",
        alignSelf: "flex-start",
        position: "absolute"
    },

    //Activity circles
    circlesBox: {
        backgroundColor: "#F2F2F2",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderColor: "lightgray",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 70,
    },
    activityCircle: {
        width: 50,
        height: 50,
        borderColor: "gray",
        borderWidth: 4,
        borderRadius: 25,
        marginLeft: 10,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
});