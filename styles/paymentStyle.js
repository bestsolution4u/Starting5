import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backgroundImage: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: "cover",
    },
    headingText: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "NotoSansKR-Light",
    },
    headingTextBox: {
        width: "80%",
        alignContent: "center",
    },
    buttonBox: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 0,
        marginTop: 20
    },
});