import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    mainBox: {
        flex: 1,
        height: 60,
        width: "95%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        alignContent: "flex-start",
        backgroundColor: "#b2b1b1",
        borderRadius: 8,
    },
    sidewaysText: {
        fontSize: 12, 
        paddingTop: 0,
        position: "absolute",
        transform: [{rotate: "90deg"}, {translateX: 22}, {translateY: 18}],
    },
    regularText: {
        width: "90%",
        paddingLeft: 20,
        margin: 0,
        alignContent: "flex-start",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    H2: {
      color: "#000000",
      fontSize: 16,
      fontFamily: "NotoSansKR-Light",
    },
});