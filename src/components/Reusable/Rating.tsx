import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { mainStyle } from '../../styles'

import Icon from '@expo/vector-icons/FontAwesome'
import MyText from './MyText'

interface Props {
  pro: any;

  onPress?: () => void;
}
const Rating: React.FC<Props> = (props) => {
  const pro = props.pro
  if (!pro.rating)
    return (null)
  return (
    <View style={styles.container}>
      <Icon name="star" size={16} />
      <MyText style={styles.rating}>{pro.rating}</MyText>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {

  },
  rating: {
    ...mainStyle.montText,
    fontSize: 13,
    color: '#0d7de9',
  },
});

export default Rating