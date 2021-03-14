import { StyleSheet } from 'react-native';
import appStyle from './appStyle';

export default StyleSheet.create({
    titleImage: {
        width: "80%",
        height: 80,
        resizeMode: "contain",
        tintColor: "white",
    },
    titleBox: {
        width: "100%",
        top: -12,
        height: 50,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    questionCard: {
        flex: 1,
        backgroundColor: "white",
        width: "100%",
        padding: 5,
        paddingTop: 20,
    },
    headerBox: {
        flex: 1,
        width: "100%", 
        height: 300,
        alignItems: "center",
        justifyContent: "flex-start",
    }, 
    headerBottomBox: {
        height: 220,
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "row", 
        width: "100%",
    },
    bodyBox: {
        width: "90%",
        height: "100%",
        top: -50,
        overflow: "visible",
    },
    bottomBox: {
        marginTop: 50,
        width: "100%",
        alignItems: "center",
    },
    progressBackground: {
        width: "90%",
        height: 30,
        borderRadius: 6,
        backgroundColor: "lightgray",
        overflow: "hidden",
    },
    progressComplete: {
        height: 30,
    },
    completedOverlay: {
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 10,
        width: "100%",
        height: "99%",
    },
    logoImage: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    }
})