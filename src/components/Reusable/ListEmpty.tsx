import React from 'react';
import { StyleSheet, View } from 'react-native';

import AssetImage from './AssetImage'
import MyText from './MyText'

interface Props {
  text: string;
  image?: any;
  textStyle?: any;
  wrapperStyle?: any;
}

const ListEmpty: React.FC<Props> = (props) => {
  return (
    <View style={[styles.empty, props.wrapperStyle || {}]}>
      { props.image &&
        <AssetImage src={props.image} style={styles.emptyPic} />
      }
      <MyText style={[styles.emptyTxt, props.textStyle || {}]}>{props.text}</MyText>
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPic: {
    width: 160,
    height: 160,
  },
  emptyTxt: {
    marginTop: 22,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
  }
});

export default ListEmpty