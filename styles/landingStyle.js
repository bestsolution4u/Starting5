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
        marginTop: 70,
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
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    headingText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "normal",
    },
    headingTextBox: {
        width: "100%",
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
        width: "70%",
        marginLeft: 20,
    },
});