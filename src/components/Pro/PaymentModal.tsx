import React from 'react';
import { StyleSheet, Text, Animated, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { AssetImage, BottomButton, SelectCreditCard } from '../Reusable'
import { Fire, Flash, Modal } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

interface Props {
  price: number;
  onPay: (counter: number, card: string) => void;
}

const PaymentModal: React.FC<Props> = (props) => {
  
  const price = props.price || 0
  const [counter, updateCounter] = React.useState(1)
  const [showCards, setShowCards] = React.useState(true)
  const [card, setCard] = React.useState('')

  const total = Number(counter * price).toFixed(2)

  const animation = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (showCards) {
      Animated.spring(animation, {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }, [showCards])

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  })

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant</Text>
        <Text style={styles.open}>Aujourd'hui 21:40 - 22:20</Text>
      </View>
      <View style={styles.quantity}>
        <Text style={styles.quantityTitle}>Choisir la quantité</Text>
        <View style={styles.quantityBtns}>
          <TouchableOpacity onPress={() => updateCounter(counter > 1 ? counter - 1 : 0)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.lightColor, marginRight: 30}]}>
              <AntDesign color={'#fff'} size={18} name="minus" />
            </View>
          </TouchableOpacity>
          <Text style={styles.counter}>{counter}</Text>
          <TouchableOpacity onPress={() => updateCounter(counter + 1)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.themeColor, marginLeft: 30}]}>
              <AntDesign color={'#fff'} size={18} name="plus" />
            </View>
          </TouchableOpacity>      
        </View>
        <Animated.View style={[styles.cards, {opacity: animation, height: height}]}>
          <Text style={styles.quantityTitle}>Votre moyen de paiement</Text>
          <SelectCreditCard cardSelected={setCard} />
        </Animated.View>

        <Text style={styles.quantityTitle}>Total {total}€</Text>
      </View>
      <View style={{backgroundColor: '#fff'}}>
        <Text style={styles.conditions}>En réservant ce panier, tu acceptes les Conditions Générales d’utilisation de All is Good</Text>
      </View>
      <BottomButton
        title={!showCards ? 'Continuer' : 'Payer ' + total + '€'}
        backgroundColor={mainStyle.themeColor}
        onPress={() => !showCards ? setShowCards(true) : props.onPay(counter, card)}
        disabled={!showCards ? counter === 0 : card === ''}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  
  header: {
    margin: 20,
    justifyContent: 'center',
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

    paddingVertical: 20,
    justifyContent: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  cards: {
    marginTop: 20,
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