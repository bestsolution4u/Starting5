import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    topBox: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        padding: 5,
    },
    topTextBox: {
        paddingRight: 10,
        width: "80%",
    },
    headingBox: {
        backgroundColor: "lightgray",
        borderRadius: 6,
        width: "90%",
    },
    headingImage: {
        height: 300,
        resizeMode: "contain",
        padding: 0,
    },
    bodyBox: {
        width: "100%",
        alignSelf: "center",
        paddingBottom: 10,
    },
    formItem: {
        flex: 1,
        width: "100%",
        paddingTop: 10,
        alignItems: "center",
    },
    formItemTitle: {
        alignSelf: "flex-start",
        marginLeft: 20,
        width: "100%",
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: "white",
        height: 40,
        width: "90%",
        backgroundColor: "#F2F2F2"
    },
    bottomBox: {
        marginTop: 20,
        alignItems: "center",
    },
});