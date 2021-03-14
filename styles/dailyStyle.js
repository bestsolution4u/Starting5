/**
 * The style sheet for the DAILY page
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    overlay: {
        borderRadius: 10,
        width: "90%",
    },
    topBox: {
        height: 160,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
    },
    returnButtonBox: {
        borderRadius: 20,
        zIndex: 999,
        top: -15,
        left: 0,
        position: "absolute",
    },
    largeArrowsImage: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    topCircleBox: {
        width: 160,
        borderRadius: 80,
        backgroundColor: "#231f20",
        justifyContent: "center",
        
    },
    topImage: {
        width: 120,
        height: 120,
        top: 20,
        left: 22,
        resizeMode: "contain",
        position: "absolute",
    },
    metricsBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    titleBox: {
        marginTop: 10,
        backgroundColor: "lightgray",
        borderRadius: 6,
        height: 30,
        justifyContent: "center",
        width: "100%",
    },
    moodImage: {
        width: 28,
        height: 28,
        marginLeft: 10,
        resizeMode: "contain",
    },
    bodyBox: {
        flex: 1,
        paddingLeft: 5,
        paddingTop: 5,
        marginTop: 20,
        marginBottom: 20,
    },
    activityBox: {
        flexDirection: "row",
    },
    activityCircleBox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        top: 5,
    },
    tickIcon: {
        width: 20,
        height: 20,
    },
    activityBodyBox: {
        paddingLeft: 20,
    },
    completedActivityGrey: {
        color: "#AAAAAA",
    },
});