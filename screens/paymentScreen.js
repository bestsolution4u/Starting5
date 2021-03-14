/**
 * Screen which displays the current subscription options, and takes the
 * user to the Apple Pay or Android Pay payment processor. Contains the
 * main screen class as well as supporting payment functions for Apple
 * and Android.
 * 
 * TODO: Dear Freelancer. Please modify this page as necessary
 */
import React from 'react';
import { View, Alert, Platform, Text, Dimensions, Image, ScrollView, Modal, TextInput, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Icon, Overlay } from 'react-native-elements';

import { LoadingModal, ErrorModal } from "../controllers/helperFunctions";
import MyHeader from "./headerFragment";

//Styles
import appStyle from "../styles/appStyle";
import paymentStyle from "../styles/paymentStyle";

const OS = Platform.OS;

//Assets
const background = require("../assets/images/miguel-a-amutio.jpg");

//Strings
const noChargeString = "No charge until 7-day trial ends.\nCancel anytime.";

/**
 * Screen which displays the current subscription options, and buttons
 * which inititate the payment process.
 */
// import * as RNIap from 'react-native-iap';

import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,

} from 'react-native-iap';

let monthlyProductId = Platform.OS === "android" ? "test_sub" : "test001";
let yearlyProductId = Platform.OS === "android" ? "test_sub" : "test001";
let purchaseUpdateSubscription;
let purchaseErrorSubscription;
const itemSubs = [
  monthlyProductId, yearlyProductId
];


export class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false, //Flag to control the "loading" modal.
      error: null, //Both controls the "error" message box, which is hidden while this is null

      receipt: '',
      productList: [],
      receipt: '',
      availableItemsMessage: '',
      transactionId: '',
     

    };
  }
  async componentDidMount() {
    try {
      const result = await RNIap.initConnection();
      await this.getSubscriptions();

    } catch (err) {
      console.warn(err.code, err.message);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            // purchase.productId;
            if (Platform.OS === 'ios') {
              finishTransactionIOS(purchase.transactionId);
              if (purchase.productId == monthlyProductId) {
                this.setState({
                  transactionId: purchase.transactionId,
                });
              }
              else if (purchase.productId == yearlyProductId) {
                this.setState({
                  transactionId: purchase.transactionId,
                });

              }
              else {
                this.setState({
                  transactionId: purchase.transactionId,

                });
              }


            } else if (Platform.OS === 'android') {
              // If consumable (can be purchased again)
              consumePurchaseAndroid(purchase.purchaseToken);
              // If not consumable
              //acknowledgePurchaseAndroid(purchase.purchaseToken);

              if (purchase.productId == monthlyProductId) {
                this.setState({
                  transactionId: purchase.purchaseToken,

                });
              }
              else if (purchase.productId == yearlyProductId) {
                this.setState({
                  transactionId: purchase.transactionId,
                });

              }

              else {
                this.setState({
                  transactionId: purchase.purchaseToken,

                });
              }
            }

            const ackResult = await finishTransaction(purchase);
            /**
             *  You will be call the api if want track into database
             */
            // this.updateaccountPerimum();


          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }

          this.setState({ receipt }, () => this.goNext());
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('purchaseErrorListener', error);
        Alert.alert('purchase error', JSON.stringify(error));
      },
    );
  }
  
  async componentWillUnmount() {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  }
  /**
   * able to show Receipt data information
   */
  goNext = () => {
     Alert.alert('Receipt', this.state.receipt);
  };


  getSubscriptions = async () => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      this.setState({ productList: products });
      console.log("Product SKUs:", products);

      // const products: Product[] = await RNIap.getProducts(productIds);
      // this.setState({ products });
    
    } catch (err) {
      Alert.alert('itemSubs', err.message);
    }
  };
  
  /**
   *  this mathod need to user for restore Purchases  Items
   */
  getPurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      const newState = { premium: false, ads: true }
      let restoredTitles = [];
      purchases.forEach(purchase => {
        switch (purchase.productId) {
          case monthlyProductId:
            //newState.premium = true
            //restoredTitles.push('Premium Version');
            break

          case yearlyProductId:
            //console.warn(err)
            // newState.ads = false
            //restoredTitles.push('No Ads');
            break

          // case 'com.example.coins100':
          //   await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
          //   CoinStore.addCoins(100);
        }
      })

      Alert.alert('Restore Successful', 'You successfully restored the following purchases: ' + restoredTitles.join(', '));
    } catch (err) {
      //console.warn(err); // standardized err.code and err.message available
      //  Alert.alert(err.message);
    }
  }
  getAvailablePurchases = async () => {
    try {
      console.info(
        'Get available purchases (non-consumable or unconsumed consumable)',
      );
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases :: ', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
      }

    } catch (err) {
      console.warn(err.code, err.message);
      // Alert.alert(err.message);
    }
  };
  /**
   * 
   * Need to call this funcation if you want Purchase items
   */
  requestPurchase = async (sku) => {
    try {
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  /**
   * 
   * Will be call this funcation when need to Subscription 
   */

  requestSubscription = async (sku) => {
    try {
      RNIap.requestSubscription(sku);
    } catch (err) {
      // Toast.show({
      //   text: err.message,
      //   position:"bottom",
      //   type: "warning"
      // });

      // Alert.alert(err.message);
    }
  };


  render() {

    return (
      <View style={appStyle.mainBox}>
        <MyHeader />

        <ImageBackground source={background} style={paymentStyle.backgroundImage}>
          <ScrollView>

            <View style={appStyle.bodyBox}>
              {/* Main text. TODO: this doesn't fit the screen properly yet */}
              <Text style={[appStyle.H2, paymentStyle.headingText]}>
                Start your free trial
              </Text>
              <Text style={[appStyle.H4, { textAlign: "center", marginTop: 10 }]}>
                {noChargeString}
              </Text>

              {/* A button like this should initiate payment */}
              <TouchableOpacity style={[appStyle.defaultButton, { width: "90%" }]}
                onPress={() => { this.requestSubscription(monthlyProductId) }}>
                <Text style={appStyle.buttonText}>Monthly Test Subscription</Text>
                <Text style={[appStyle.buttonText, appStyle.H3]}>AU$21.99</Text>
              </TouchableOpacity>
            </View>

            <View style={appStyle.bodyBox}>

              <TouchableOpacity style={[appStyle.defaultButton, { width: "90%" }]}
                onPress={() => { this.requestSubscription(yearlyProductId) }}>
                <Text style={appStyle.buttonText}>Yearly Test Subscription</Text>
                <Text style={appStyle.buttonText}>AU$21.99</Text>
              </TouchableOpacity>
            </View>

            {/* HOME button */}
            <View style={paymentStyle.buttonBox}>
              <TouchableOpacity style={[appStyle.defaultButton, { width: "90%" }]}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={appStyle.buttonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}