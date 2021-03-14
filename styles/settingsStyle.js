import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    menuItem: {
        flex: 1,
        height: 60,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#F2F2F2",
        paddingLeft: 20,
        flexDirection: "row",
    },

    bottomBox: {
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    changePasswordModalBox: {
        width: "90%",
        minHeight: 200,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 6,
    },
});