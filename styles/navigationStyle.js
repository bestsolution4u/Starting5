import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    mainBox: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
    },
    buttonBox: {
        flex: 1,
        alignItems: "center",
    },
    buttonText: {
        alignContent: "center",
        height: 20,
    },
    iconImage: {
        width: 30,
        height: 50,
        position: "relative", 
        resizeMode: "contain",
        margin: 0,
        tintColor: "black",
    }
})