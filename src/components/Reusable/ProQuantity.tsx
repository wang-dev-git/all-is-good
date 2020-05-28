import * as React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { mainStyle } from '../../styles'

import MyText from './MyText'
import VeilView from './VeilView'

interface Props {
  pro: any;
}
const ProQuantity: React.FC<Props> = (props) => {
  const lang = useSelector(state => state.langReducer.lang)
  const pro = props.pro
  const quantity = 0//pro.quantity || 0
  return (
    <View style={[styles.quantity]}>
      {quantity === 0 &&
        <VeilView abs start='rgba(0,0,0,0.3)' end='rgba(0,0,0,0.3)' />
      } 
      <MyText style={styles.quantityTxt}>{quantity > 0 ? (lang.PRO_TO_SAVE || '').replace('%COUNT%', quantity) : lang.PRO_NONE_TO_SAVE}</MyText>            
    </View>
  );
} 

const styles = StyleSheet.create({
  quantity: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: mainStyle.orangeColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityTxt: {
    ...mainStyle.montBold,
    color: '#fff',
    textTransform: 'uppercase'
  },
});

export default ProQuantity