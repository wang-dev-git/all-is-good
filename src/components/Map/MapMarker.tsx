import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AssetImage, MyText } from '../Reusable'

import { mainStyle } from '../../styles'

interface Props {
  count?: number;
  selected: boolean;
}
const MapMarker: React.FC<Props> = (props) => {
  return (
    <View>
      <View
        style={[
          styles.container,
          props.selected ? styles.selected : {},
          !!props.count ? styles.veryBig : {},
        ]}>
        <AssetImage src={require('../../images/logo_green.png')} />
      </View>
      { !!props.count &&
        <View style={styles.count}>
          <MyText style={styles.countTxt}>{props.count}</MyText>
        </View>
      }
    </View>
  )  
}

const smallSize = 32
const bigSize = 42
const veryBigSize = 52
const styles = StyleSheet.create({
  container: {
    ...mainStyle.circle(smallSize),
    borderColor: mainStyle.themeColor,
    borderWidth: 2,

    backgroundColor: '#fff',
  },
  selected: {
    ...mainStyle.circle(bigSize),
  },
  veryBig: {
    ...mainStyle.circle(veryBigSize),
  },
  count: {
    position: 'absolute',
    top: -6,
    right: -6,
    ...mainStyle.circle(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  countTxt: {
    ...mainStyle.montBold,
    fontSize: 14, 
    color: mainStyle.themeColor
  }
});

export default MapMarker