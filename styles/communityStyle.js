import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    headingText: {
      textAlign: "right", 
      paddingRight: 10,
      paddingBottom: 10,
    },
    dottedLine: {
      height: 1,
      borderRadius: 1,
      borderWidth: 2,
      borderStyle: "dotted",
      width: "80%",
      alignSelf: "center",
    },
    postMainBox: {
      width: "90%",
      alignSelf: "center",
      paddingTop: 5,
      paddingBottom: 5,
    },
    postBodyBox: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      paddingBottom: 10,
    },
    postProfileBox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#0088FF",
      marginRight: 5,
    },
    postTextBox: {
      paddingBottom: 10,
      flex: 1,
    },
    postSideBox: {
      width: 50,
      height: 100,
      backgroundColor: "#DDDDDD",
      borderRadius: 6,
    },
    postIconBox: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      padding: 5,
    },
    iconImage: {
      width: 18,
      height: 18,
      resizeMode: "contain",
    },
    postExpandBox: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-end",
    },
    arrowsImage: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
    arrowsDown: {
        transform: [{rotate: "-90deg"}],
    },
    olderPostsBox: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
    },
    olderPostsCircle: {
        width: 20,
        height: 20,
        borderRadius: 15,
        backgroundColor: "#000000",
        marginRight: 5,
    },
});