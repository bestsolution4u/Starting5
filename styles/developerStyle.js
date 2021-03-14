import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    whiteHeader: {
        height: 40, 
        width: "100%",
        backgroundColor: "white", 
        alignItems: "center",
        marginBottom: 40,
    },
    largeBlackBox: {
        width: "100%",
        backgroundColor: "black",
        alignItems: "center",
    },
    profilePicBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    profileImage: {
        padding: 0,
        resizeMode: "contain",
        width: 86,
        height: 86,
        tintColor: "black",
        backgroundColor: "white",
    },
    statsBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
        height: 100,
    },
    statItemBox: {
        width: "30%",
        alignItems: "center",
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: "gray",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        overflow: "visible",
    },
    buttonList: {
        flex: 1,
        marginTop: 40,
        marginBottom: 20,
        width: "100%",
        alignItems: "center",
    },
    button: {
        borderRadius: 6,
        width: "80%",
        minHeight: 35,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
    },
    devControlsBox: {
        marginTop: 10,
        marginBottom: 10,
        width: "90%",

    }
})