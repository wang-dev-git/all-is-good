import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import VeilView from './VeilView'

import Icon from '@expo/vector-icons/FontAwesome';

interface Props {
  title: string;
  titleColor?: string;
  backgroundColor: string;
  style?: any;
  disabled?: boolean;

  onPress: () => void;
}
const BottomButton: React.FC<Props> = (props) => {
  const veil = props.disabled ? '0' : '255'
  return (
    <TouchableOpacity
      style={[styles.wrapper, {opacity: props.disabled ? 0.46 : 1}]}
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
        <Text style={[styles.title, props.titleColor ? {color: props.titleColor} : {}]}>{props.title.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
} 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',
    height: 60,

    paddingLeft: 20,
    paddingRight: 20,

    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrapper: {
    flex: 1,
  }
});

export default BottomButton