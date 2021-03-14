import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    modalBox: { 
        width: "90%",
        padding: 0,
        backgroundColor: "white",
        minHeight: 400,
        zIndex: 900,
      },
      modalCloseBox: {
        zIndex: 999,
        alignSelf: "flex-start",
        position: "absolute",
        marginLeft: 10,
      },
      slidersMainBox: {
        marginTop: 30,
        width: "100%",
        alignItems: "center",
      },
      sliderStyle: {
        width: "80%",
        height: 40,
        marginBottom: 20,
      },
      bottomBox: {
        width: "90%",
        alignSelf: "center",
      },
});