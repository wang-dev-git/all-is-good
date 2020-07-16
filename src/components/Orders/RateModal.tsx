import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Text, Animated, View, Slider, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { AssetImage, BottomButton, SelectCreditCard, MyText } from '../Reusable'
import { Fire, Flash, Modal, Loader } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'
import { updateUser } from '../../actions/auth.action'

interface Props {
  order: any;

  onRated: () => void;
}
const RateModal: React.FC<Props> = (props) => {
  
  const lang = useSelector(state => state.langReducer.lang)
  const [rating, setRating] = React.useState(0)

  const onConfirm = async () => {
    Loader.show(lang.GLOBAL_SENDING)
    try {
      const orderRef = Fire.store().collection('orders').doc(props.order.id)
      await orderRef.update({ rating: rating })

      props.onRated()
      Modal.hide('rating')
    } catch (err) {
      console.log(err)
    }
    Loader.hide()
  }

  const onSelect = (n: number) => {
    setRating(n)
  }

  const isSelected = (n: number) => {
    return (n <= rating)
  }

  return (
    <View style={{backgroundColor: mainStyle.themeColor}}>
      <View style={styles.header}>
        <MyText type='bold' style={styles.title}>{lang.RATE_TITLE}</MyText>
      </View>
      <MyText style={styles.subtitle}>{lang.RATE_SUBTITLE}</MyText>
      <View style={styles.content}>
        <TouchableOpacity style={[styles.star, isSelected(1) ? styles.selected : {}]} onPress={() => onSelect(1)}>
          <AntDesign name="star" size={size} color={isSelected(1) ? mainStyle.orangeColor : '#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.star, isSelected(2) ? styles.selected : {}]} onPress={() => onSelect(2)}>
          <AntDesign name="star" size={size} color={isSelected(2) ? mainStyle.orangeColor : '#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.star, isSelected(3) ? styles.selected : {}]} onPress={() => onSelect(3)}>
          <AntDesign name="star" size={size} color={isSelected(3) ? mainStyle.orangeColor : '#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.star, isSelected(4) ? styles.selected : {}]} onPress={() => onSelect(4)}>
          <AntDesign name="star" size={size} color={isSelected(4) ? mainStyle.orangeColor : '#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.star, isSelected(5) ? styles.selected : {}]} onPress={() => onSelect(5)}>
          <AntDesign name="star" size={size} color={isSelected(5) ? mainStyle.orangeColor : '#fff'} />
        </TouchableOpacity>
      </View>
      <BottomButton
        title={lang.RATE_CONFIRM}
        titleColor={mainStyle.themeColor}
        backgroundColor={'#fff'}
        onPress={onConfirm}
        />
    </View>
  );
}

const size = 50
const styles = StyleSheet.create({
  
  header: {
    marginVertical: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 16,
  },
  content: {
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  star: {

  }
});

export default RateModal