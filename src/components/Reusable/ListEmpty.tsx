import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import AssetImage from './AssetImage'
import MyText from './MyText'

import { mainStyle } from '../../styles'

interface Props {
  text: string;
  image?: any;
  textStyle?: any;
  wrapperStyle?: any;

  btnTxt?: string;
  btnStyle?: any;
  onPressBtn?: () => void;
}

const ListEmpty: React.FC<Props> = (props) => {
  return (
    <View style={[styles.container, props.wrapperStyle || {}]}>
      { props.image &&
        <AssetImage src={props.image} style={styles.picture} />
      }
      <MyText style={[styles.text, props.textStyle || {}]}>{props.text}</MyText>
      { props.btnTxt !== undefined &&
        <TouchableOpacity style={[styles.btn, props.btnStyle || {}]} onPress={props.onPressBtn}>
          <MyText type='bold' style={styles.btnTxt}>{props.btnTxt}</MyText>
        </TouchableOpacity>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: 160,
    height: 160,
    marginBottom: 22,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
  },
  btn: {
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 23,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  btnTxt: {
    color: mainStyle.themeColor,
  }
});

export default ListEmpty