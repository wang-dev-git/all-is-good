import React from 'react';
import { StyleSheet, View } from 'react-native';
import { mainStyle } from '../../styles'

interface Props {}
const ProNotifyScreen: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>

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
});

export default ProNotifyScreen
