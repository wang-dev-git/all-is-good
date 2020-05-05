import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import VeilView from './VeilView'
import MyText from './MyText'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import Icon from '@expo/vector-icons/FontAwesome';

interface Props {
  title: string;
  titleColor?: string;
  backgroundColor: string;
  style?: any;
  disabled?: boolean;
  abs?: boolean;

  onPress: () => void;
}
const BottomButton: React.FC<Props> = (props) => {
  const veil = props.disabled ? '0' : '255'
  return (
    <TouchableOpacity
      style={[styles.wrapper, {opacity: props.disabled ? 1 : 1}, props.abs ? styles.abs : {}]}
      onPress={props.onPress}
      disabled={props.disabled}
      >
      <View style={[styles.container, { backgroundColor: props.backgroundColor }, props.style || {}]}>
        <VeilView
          abs
          start={'rgba(' + veil + ', ' + veil + ', ' + veil + ', 0.3)'}
          end={'rgba(' + veil + ', ' + veil + ', ' + veil + ', 0.0)'}
          startPos={{x: 0.2, y: 0}}
          endPos={{x: 1, y: 1}}
          />
        <MyText style={[styles.title, props.titleColor ? {color: props.titleColor} : {}]}>{props.title}</MyText>
      </View>
    </TouchableOpacity>
  );
} 

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',
    ...ifIphoneX({
      height: 80,
      paddingBottom: 20,
    }, {
      height: 60,
    }),

    paddingLeft: 20,
    paddingRight: 20,
  },
  abs: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default BottomButton