import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface Props {
  children?: any;
  style?: any;

  type?: 'bold' | 'light' | 'normal';
}

const MyText: React.FC<Props> = (props) => {
  return (
    <Text style={[
      styles.txt,
      props.type === 'bold' ? styles.txtBold :
      props.type === 'light' ? styles.txtLight : {},
      props.style || {}]}>{props.children}</Text>
  )
}

const styles = StyleSheet.create({
  txt: {
    fontSize: 15,
  },
  txtBold: {
    fontFamily: 'nunito-bold',
  },
  txtLight: {
    fontFamily: 'nunito-light',
  }
});

export default MyText