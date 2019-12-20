import React from 'react';
import { StyleSheet, View } from 'react-native';

import { mainStyle } from '../../styles'

interface Props {
  color: string;
  selected: boolean;
}
const MapBubble: React.FC<Props> = (props) => {
  return (
    <View>
      <View style={[
        styles.border,
        { borderColor: props.color },
        props.selected ? styles.selected : {}
      ]}></View> 
      
      <View style={styles.wrapper}>
        <View style={[
          styles.contentColor,
          { backgroundColor: props.color },
          props.selected ? styles.contentSelected : {}
        ]}></View>
      </View>
    </View>
  )  
}

const smallSize = 24
const bigSize = 36
const styles = StyleSheet.create({
  border: {
    ...mainStyle.circle(smallSize),
    borderColor: mainStyle.themeColor,
    borderWidth: 2,

    justifyContent: 'center',
    alignItems: 'center',

    opacity: 0.4
  },
  selected: {
    ...mainStyle.circle(bigSize),
  },
  contentSelected: {
    ...mainStyle.circle(bigSize - 10),
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    justifyContent: 'center',
    alignItems: 'center',
  },
  contentColor: {
    ...mainStyle.circle(smallSize - 10),
    backgroundColor: mainStyle.themeColor
  }
});

export default MapBubble