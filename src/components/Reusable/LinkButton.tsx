import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { mainStyle } from '../../styles'

interface Props {
  title: string;
  color: string;
  style?: any;
  textStyle?: any;
  disabled?: boolean;

  onPress: () => void;
}
const LinkButton: React.FC<Props> = (props) => {
  const veil = props.disabled ? '0' : '255'
  return (
    <TouchableOpacity
      style={[props.style ? props.style : {}, {opacity: props.disabled ? 0.46 : 1}]}
      onPress={props.onPress}
      disabled={props.disabled}
      >   
      <Text style={[styles.title, props.color ? {color: props.color} : {}, props.textStyle ? props.textStyle : {}]}>{props.title}</Text>
    </TouchableOpacity>
  );
} 

const styles = StyleSheet.create({
  container: {

  },
  title: {
    ...mainStyle.montText,
    fontSize: 13,
    color: '#0d7de9',
  },
});

export default LinkButton