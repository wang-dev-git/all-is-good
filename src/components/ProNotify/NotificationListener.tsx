import {
  androidOffNotificationStackLength,
  disableAndroidOffNotificationListener,
  getAndroidOffNotificationFromStack,
  NotificationAction,
} from '../notification'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
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
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)

  if (existingStatus !== Permissions.PermissionStatus.GRANTED) {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)

    if (status !== Permissions.PermissionStatus.GRANTED) {
      return false
    }
  }

  return true
}
