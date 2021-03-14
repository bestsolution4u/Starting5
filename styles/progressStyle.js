import { StyleSheet } from 'react-native';
import appStyle from './appStyle';

export default StyleSheet.create({
    dayCircle: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "white",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginLeft: 5,
        marginRight: 5,
        overflow: "visible",
    },
    completeCircle: {
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: appStyle.pinkColour.backgroundColor,
    },
    calendarBox: {
        marginTop: 20,
        maxWidth: 351,
        flexDirection: "row",
        flexWrap:"wrap",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center",
    },
    titleBox: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: "center",
        alignContent: "center",
    },
    bottomBox: {
        flex: 1,
        width: "100%",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",

    },
    quoteModalBox: {
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        paddingBottom: 20,
    }
})