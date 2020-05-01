import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { mainStyle } from '../../styles'
import AntDesign from '@expo/vector-icons/AntDesign'

import MyText from './MyText'

interface Props {
  title: string;
  icon?: string;
  style?: any;
  textStyle?: any;
  iconColor?: string;
  iconSize?: number;
  disabled?: boolean;

  onPress: () => void;
}
const SmallButton: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.style ? props.style : {}, {opacity: props.disabled ? 0.46 : 1}]}
      onPress={props.onPress}
      disabled={props.disabled}
      >
      {props.icon && <AntDesign name={props.icon} color={props.iconColor || '#000'} size={props.iconSize || 18} />}
      <MyText numberOfLines={1} style={[styles.title, props.textStyle ? props.textStyle : {}]}>{props.title}</MyText>
    </TouchableOpacity>
  );
} 

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 26,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: mainStyle.themeColor,
    borderRadius: 22,
    overflow: 'hidden',
  },
  title: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: '#fff',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
});

export default SmallButton