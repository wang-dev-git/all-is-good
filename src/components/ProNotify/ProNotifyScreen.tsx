import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text, Alert, Pressable, Modal, Linking, Button } from 'react-native';

import * as Notifications from 'expo-notifications';
import { Actions } from 'react-native-router-flux'

import Constants from 'expo-constants';

import { mainStyle } from '../../styles'
import { Fire } from '../../services'

interface Props { }
let dingListener = null

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ProNotifyScreen: React.FC<Props> = (props) => {

  const user = useSelector(state => state.authReducer.user);

  const [lastOrder, setLastOrder] = React.useState(null);
  const [showNotify, setShowNotify] = React.useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

    listenForOrders();
    registerForPushNotificationsAsync().then(token => {
      Fire.update('pros', user.id, { "expoPushToken": token })
      setExpoPushToken(token)
    });
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      Actions.jump('proNotify');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

  const listenForOrders = () => {
    if (dingListener != null) {
      return;
    }
    const dingRef = Fire.store().collection('pros').doc(user.id).collection('last_orders').doc('last_order')
    dingListener = dingRef.onSnapshot((doc) => {
      if (doc.exists) {
        const res = {
          id: doc.id,
          ...doc.data()
        }
        console.log(res);
        setLastOrder(res);
        // Disable modal
        //setShowNotify(true);
        // sendPushNotification(expoPushToken);
      } else {
        setLastOrder(null)

      }
    })
  }

  async function sendPushNotification(expoPushToken) {
    console.log("send notification 2");
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'New Order',
      body: 'Please tap here to open the app',
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const NotifyNewOrderAlert = () => {
    return (
      Alert.alert(
        "New order recieved",
        "Order nr. - " + lastOrder.id,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      )
    )
  }


  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <Button title="View Orders" onPress={handlePress} color="#fff" />
      // <Pressable
      //   style={[styles.button, styles.buttonOrders]}
      //   onPress={() => handlePress}
      // >
      //   <Text style={styles.buttonOrdersText}>View Orders</Text>
      // </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Everything is set up</Text>
      <Text style={styles.subText}>Waiting for orders...</Text>
      <View style={styles.buttonContainer}>
        <OpenURLButton url={"https://partners.allisgood-app.com/#/orders"}></OpenURLButton>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotify}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setShowNotify(!showNotify);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New Order</Text>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowNotify(!showNotify)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainStyle.themeColor,
  },
  content: {
    flex: 1,
  },
  heading: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold"
  },
  subText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 22,
    color: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: 20,
    display: "flex",
    alignItems: "center"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOrders: {
    backgroundColor: "#fff",
    padding: 20,
    width: 150,
    color: "#000",
    margin: "auto",
  },
  buttonOrdersText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default ProNotifyScreen
