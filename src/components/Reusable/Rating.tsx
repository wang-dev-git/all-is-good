import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { mainStyle } from '../../styles'

import Icon from '@expo/vector-icons/FontAwesome'
import MyText from './MyText'

interface Props {
  pro: any;
  style?: any;

  onPress?: () => void;
}
const Rating: React.FC<Props> = (props) => {
  const pro = props.pro
  if (!pro.rating)
    return (null)
  return (
    <View style={[styles.container, props.style || {}]}>
      <Icon name="star" size={16} color='orange' />
      <MyText style={styles.rating}>{Number(pro.rating / pro.nb_ratings).toFixed(1)}</MyText>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    ...mainStyle.montText,
    fontSize: 13,
    color: '#000',
    marginLeft: 4,
  },
});

export default Rating