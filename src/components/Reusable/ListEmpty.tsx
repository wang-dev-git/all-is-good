import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import AssetImage from './AssetImage'
import MyText from './MyText'

import { mainStyle } from '../../styles'

interface Props {
  text: string;
  subtext?: string;
  image?: any;
  imageSize?: number;
  textStyle?: any;
  wrapperStyle?: any;

  btnTxt?: string;
  btnStyle?: any;
  onPressBtn?: () => void;
}

const ListEmpty: React.FC<Props> = (props) => {
  const size = props.imageSize || 160
  return (
    <View style={[styles.container, props.wrapperStyle || {}]}>
      { props.image &&
        <AssetImage src={props.image} style={[styles.picture, { width: size, height: size }]} />
      }
      <MyText type='bold' style={[styles.text, props.textStyle || {}]}>{props.text}</MyText>
      { props.subtext &&
        <MyText type='bold' style={[styles.subtext, props.textStyle || {}]}>{props.subtext}</MyText>
      }
      
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
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    marginBottom: 22,
  },
  text: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtext: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
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
  },
});

export default ListEmpty