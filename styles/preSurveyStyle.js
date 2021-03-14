import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    mainBox: {
        flex: 1, 
        width: "100%",
        alignItems: 'center', 
        justifyContent: 'center',
        alignContent: "center",
    },
    s5Image: {
        width: 128,
        height: 128,
        resizeMode: "contain",
        marginTop: 50,
        marginLeft: 30,
        marginBottom: 10,
    },
    titleBox: {
        width: "100%",
        alignItems: "center",
        marginTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
    },
    backgroundImage: {
        flex: 1,
        width: "120%",
        height: "120%",
        resizeMode: "stretch",
    },
    headingText: {
        fontSize: 20,
        fontWeight: "normal",
    },
    headingTextBox: {
        width: "80%",
    },
    buttonBox: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 0,
    },
    loginModalBox: {
        width: "90%",
        minHeight: 200,
        backgroundColor: "white",
    },
    textInput: {
        backgroundColor: "white",
        height: 40,
        width: "10%",
        marginLeft: 20,
    },
    signupModalBod: {
        width: "90%",
        minHeight: 200,
        backgroundColor: "white",

    },
    textInput: {
        backgroundColor: "white",
        height: 40,
        width: "80%",
    },
});