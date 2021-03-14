import { StyleSheet } from 'react-native';

import appStyle from '../styles/appStyle';

export default StyleSheet.create({
    activityItem: {
        flexDirection: "row",
        marginBottom: -20,
    },
    flagIcon: {
        width: 30,
        height: 30,
        tintColor: appStyle.greenColour.backgroundColor,
        marginLeft: 20,
    },
});