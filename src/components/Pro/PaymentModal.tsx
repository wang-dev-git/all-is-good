import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, Animated, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { AssetImage, BottomButton, SelectCreditCard } from '../Reusable'
import { Fire, Flash, Modal, Time } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

interface Props {
  pro: any;
  onPay: (counter: number, card: string) => void;
}

const PaymentModal: React.FC<Props> = (props) => {
  
  const quantity_max = props.pro.quantity || 0
  const price = props.pro.price || 0
  const [counter, setCounter] = React.useState(1)
  const [showCards, setShowCards] = React.useState(false)
  const [card, setCard] = React.useState('')
  const [mode, setMode] = React.useState('')

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

  const updateCounter = (delta: number) => {
    const newCounter = counter + delta
    if (newCounter > quantity_max)
      setCounter(quantity_max)
    else if (newCounter < 0)
      setCounter(0)
    else
      setCounter(newCounter)
  }

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  })
  
  const opening = Time.getPickUpRange(props.pro)
  const lang = useSelector(state => state.langReducer.lang)

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant</Text>
        <Text style={styles.open}>{lang.GLOBAL_TODAY} {opening}</Text>
      </View>
      <View style={styles.quantity}>
        <Text style={styles.subtitle}>{lang.PAYMENT_QUANTITY}</Text>
        <View style={styles.quantityBtns}>
          <TouchableOpacity onPress={() => updateCounter(-1)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.lightColor, marginRight: 30}]}>
              <AntDesign color={'#fff'} size={18} name="minus" />
            </View>
          </TouchableOpacity>
          <Text style={styles.counter}>{counter}</Text>
          <TouchableOpacity onPress={() => updateCounter(1)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.themeColor, marginLeft: 30}]}>
              <AntDesign color={'#fff'} size={18} name="plus" />
            </View>
          </TouchableOpacity>      
        </View>

        <Animated.View style={[styles.cards, {opacity: animation, height: height}]}>
          <Text style={styles.subtitle}>{lang.PAYMENT_MODE}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.modeContainer} onPress={() => setMode('pick_up')}>
              <View style={styles.modeCheck}>
                { mode === 'pick_up' &&
                  <AntDesign name="check" size={14} />
                }
              </View>
              <Text>{lang.PAYMENT_PICK_UP}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modeContainer} onPress={() => setMode('delivery')}>
              <View style={styles.modeCheck}>
                { mode === 'delivery' &&
                  <AntDesign name="check" size={14} />
                }
              </View>
              <Text>{lang.PAYMENT_DELIVERY}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.cards, {opacity: animation, height: height}]}>
          <Text style={styles.subtitle}>{lang.PAYMENT_METHOD}</Text>
          <SelectCreditCard cardSelected={(card) => setCard(card)} />
        </Animated.View>

        <Text style={styles.subtitle}>
          Total: {Number(price).toFixed(2)}$
          (<Text style={{textDecorationLine: 'line-through'}}>{Number(Number(price) * 1.7).toFixed(2)}$</Text>)
        </Text>
    </View>
      {/*}
      <View style={{backgroundColor: '#fff'}}>
        <Text style={styles.conditions}>En réservant ce panier, tu acceptes les Conditions Générales d’utilisation de All is Good</Text>
      </View>
    */}
      <BottomButton
        title={!showCards ? 'Continuer' : 'Payer ' + total + '$'}
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
    //borderBottomColor: '#ddd',
    //borderBottomWidth: 1,
    marginBottom: 20,
  },

  subtitle: {
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

  modeContainer: {

    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 22,

    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
  },
  modeCheck: {
    width: 14,
    marginRight: 12,
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