import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    topBox: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        backgroundColor: "black",
    },
    headingBox: {
        backgroundColor: "lightgray",
        borderRadius: 6,
        width: "90%",
    },
    headingImage: {
        height: 300,
        resizeMode: "contain",
    },
    bodyBox: {
        width: "100%",
        paddingTop: 20,
        paddingLeft: 10,
        paddingBottom: 10,
        backgroundColor: "black",
    },
    bottomBox: {
        alignItems: "center",
        margin: 10,
    },
});