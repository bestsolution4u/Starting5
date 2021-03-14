
import { StyleSheet } from 'react-native';

export default StyleSheet.create({

    logo: {
        width: 32,
        height: 32,
        position: "absolute",
        top: 20,
    },
    headerImage: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
    },
    calendar: {
        marginBottom: 0,
    },
    day: {
        paddingTop: 0,
        paddingLeft: 0,
        fontSize: 16,
        height: 55,
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#F0F0F0",
    },
    todayColour: {
        borderRadius: 20,
        backgroundColor: 'lightblue',
        color: 'gray'
    },
    defaultColour: {

    },
    enabledDay: {
        color: 'black',
    },
    disabledDay: {
        color: 'lightgray',
    },
    headerText: {
        backgroundColor: "#BBBBBB",
        color: "#333355",
        fontSize: 24,
        fontFamily: "NotoSansKR-Light",
    }
});