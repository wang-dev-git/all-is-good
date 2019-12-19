import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { AssetImage, BottomButton } from '../Reusable'
import { Fire, Flash, Modal } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

interface Props {
  onPay: (counter: number) => void;
}

const PaymentModal: React.FC<Props> = (props) => {
  
  const [counter, updateCounter] = React.useState(0)

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant</Text>
        <Text style={styles.open}>Aujourd'hui 21:40 - 22:20</Text>
      </View>
      <View style={styles.quantity}>
        <Text style={styles.quantityTitle}>Choisir la quantity</Text>
        <View style={styles.quantityBtns}>
          <TouchableOpacity onPress={() => updateCounter(counter > 1 ? counter - 1 : 0)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.lightColor}]}>
              <AntDesign color={'#fff'} size={18} name="minus" />
            </View>
          </TouchableOpacity>
          <Text style={styles.counter}>{counter}</Text>
          <TouchableOpacity onPress={() => updateCounter(counter + 1)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.themeColor}]}>
              <AntDesign color={'#fff'} size={18} name="plus" />
            </View>
          </TouchableOpacity>      
        </View>
        <Text style={styles.quantityTitle}>Total 16€</Text>
      </View>
      <View>
        <Text style={styles.conditions}>En réservant ce panier, tu acceptes les Conditions Générales d’utilisation de All is Good</Text>
      </View>
      <BottomButton
        title="Payer 16,00€"
        backgroundColor={mainStyle.themeColor}
        onPress={() => props.onPay(counter)}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  
  header: {
    margin: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  title: {
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 15,
  },
  open: {
    ...mainStyle.montLight,
    textAlign: 'center',
    marginTop: 6,
  },

  quantity: {

    paddingBottom: 20,
    justifyContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 20,
  },

  quantityTitle: {
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 12,
  },
  quantityBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  counter: {
    width: 80,
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 22,
  },
  btn: {
    ...mainStyle.circle(42),
    justifyContent: 'center',
    alignItems: 'center',
  },

  conditions: {

    ...mainStyle.montLight,
    fontSize: 12,
    color: mainStyle.lightColor,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    paddingHorizontal: 20,
    marginVertical: 20,
  }
});

export default PaymentModal