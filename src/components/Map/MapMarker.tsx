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
          <MyText style={{fontSize: 14}}>{props.count}</MyText>
        </View>
      }
    </View>
  )  
}

const smallSize = 24
const bigSize = 36
const veryBigSize = 42
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
    top: -8,
    right: -8,
    ...mainStyle.circle(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default MapMarker