import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { mainStyle } from '../../styles'

import MyText from './MyText'

interface Props {
  count: number;
  backgroundColor?: string;
}
const NotifBubble: React.FC<Props> = (props) => {
  if (props.count == 0)
    return (null)
  return (
    <View style={[
      styles.container,
      props.count > 0 ? mainStyle.circle(18) : {...mainStyle.circle(9), top: 6, right: 14},
      props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
    ]}>
      {props.count > 0 && <MyText style={styles.count}>{props.count}</MyText>}
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    
    backgroundColor: mainStyle.redColor,
    position: 'absolute',
    right: 12,
    top: 8,
  },
  count: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  }
});

export default NotifBubble