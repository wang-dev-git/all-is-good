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
  const [showModes, setShowModes] = React.useState(false)
  const [card, setCard] = React.useState('')
  const [mode, setMode] = React.useState('')

  const total = Number(counter * price).toFixed(2)

  const cardsAnimation = React.useRef(new Animated.Value(1)).current
  const modesAnimation = React.useRef(new Animated.Value(1)).current

  React.useEffect(() => {
    if (showCards) {
      Animated.spring(cardsAnimation, {
        toValue: 0,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    } else {
      Animated.spring(cardsAnimation, {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }, [showCards])

  React.useEffect(() => {
    if (showModes) {
      Animated.spring(modesAnimation, {
        toValue: 0,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    } else {
      Animated.spring(modesAnimation, {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }, [showModes])

  const updateCounter = (delta: number) => {
    const newCounter = counter + delta
    if (newCounter > quantity_max)
      setCounter(quantity_max)
    else if (newCounter < 0)
      setCounter(0)
    else
      setCounter(newCounter)
  }

  const opacityCards = cardsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })
  const translateCards = cardsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  })
  const opacityModes = modesAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })
  const translateModes = modesAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
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
        <Text style={styles.subtitle}>{lang.PAYMENT_CHOOSE_QUANTITY}</Text>
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

        <Animated.View style={[styles.modes, {opacity: showModes ? 1 : 0, transform: [{translateY: translateModes}]}]}>
          <TouchableOpacity style={styles.line} onPress={() => setShowModes(false)}>
            <Text style={styles.lineTitle}>{lang.PAYMENT_QUANTITY}</Text>
            <Text style={styles.lineValue}>{counter}</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>{lang.PAYMENT_CHOOSE_MODE}</Text>
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

        <Animated.View style={[styles.cards, {opacity: showCards ? 1 : 0, transform: [{translateY: translateCards}]}]}>
          <TouchableOpacity style={styles.line} onPress={() => setShowCards(false)}>
            <Text style={styles.lineTitle}>{lang.PAYMENT_CHOOSE_MODE}</Text>
            <Text style={styles.lineValue}>{mode === 'delivery' ? lang.PAYMENT_DELIVERY : lang.PAYMENT_PICK_UP}</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>{lang.PAYMENT_CHOOSE_METHOD}</Text>
          <SelectCreditCard cardSelected={(card) => setCard(card)} />
        </Animated.View>
        
    </View>
    <Text style={styles.subtitle}>
      Total: {Number(total).toFixed(2)}$
      (<Text style={{textDecorationLine: 'line-through'}}>{Number(Number(price * counter) * 1.7).toFixed(2)}$</Text>)
    </Text>
      {/*}
      <View style={{backgroundColor: '#fff'}}>
        <Text style={styles.conditions}>En réservant ce panier, tu acceptes les Conditions Générales d’utilisation de All is Good</Text>
      </View>
    */}
      <BottomButton
        title={!showCards ? 'Continuer' : 'Payer ' + total + '$'}
        backgroundColor={mainStyle.themeColor}
        onPress={() => !showModes ? setShowModes(true) : !showCards ? setShowCards(true) : props.onPay(counter, card)}
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

  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    height: 50,
  },
  lineTitle: {
    ...mainStyle.montText,
  },
  lineValue: {
    ...mainStyle.montBold,
  },

  quantity: {

    height: 230,

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
  modes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  cards: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
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