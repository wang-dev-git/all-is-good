import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { mainStyle } from '../../styles'

import Icon from '@expo/vector-icons/FontAwesome'
import MyText from './MyText'

interface Props {
  pro: any;
  style?: any;
  textStyle?: any;

  onPress?: () => void;
}
const Rating: React.FC<Props> = (props) => {
  const pro = props.pro
  if (!pro.rating)
    return (null)
  const nb = Math.ceil(pro.rating / pro.nb_ratings)
  const arr = Array(nb).fill(0)
  return (
    <View style={[styles.container, props.style || {}]}>
      { arr.map((item, index) => (
        <View key={index} style={styles.icon}>
          <Icon name="star" size={16} color='orange' />
        </View>
      ))}
      <MyText style={[styles.rating, props.textStyle || {}]}>({pro.nb_ratings})</MyText>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 2,
  },
  rating: {
    ...mainStyle.montBold,
    fontSize: 13,
    color: '#000',
    marginLeft: 4,
  },
});

export default Rating