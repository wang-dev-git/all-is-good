import {
  androidOffNotificationStackLength,
  disableAndroidOffNotificationListener,
  getAndroidOffNotificationFromStack,
  NotificationAction,
} from '../notification'
import * as Notifications from 'expo-notifications'
import * as React from 'react'
import { useDispatch } from 'react-redux'

export const NotificationListener = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    void getNotificationPermission().then(granted => {
      granted && dispatch(NotificationAction.getExpoToken())
    })

    while (androidOffNotificationStackLength() > 0) {
      const notification = getAndroidOffNotificationFromStack()
      notification && dispatch(NotificationAction.receivedPushNotification(notification))
    }
    disableAndroidOffNotificationListener()

    const notificationResponseReceived = Notifications.addNotificationResponseReceivedListener(({ notification }) => {
      dispatch(NotificationAction.receivedPushNotification(notification))
    })

    const notificationReceived = Notifications.addNotificationReceivedListener(notification => {
      dispatch(NotificationAction.receivedPushNotification(notification))
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationResponseReceived)
      Notifications.removeNotificationSubscription(notificationReceived)
    }
  }, [])

  return null
}

async function getNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync()

  if (status !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()

    if (status !== 'granted') {
      return false
    }
  }

  return true
}
