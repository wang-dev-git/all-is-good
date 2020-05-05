import React from 'react';
import { useSelector } from 'react-redux'
import { StyleSheet, Text, Animated, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { AssetImage, BottomButton, SelectCreditCard, MyText } from '../Reusable'
import { Fire, Flash, Modal } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

interface Props {
}
const FiltersModal: React.FC<Props> = (props) => {
  
  const lang = useSelector(state => state.langReducer.lang)
  const [address, setAddress] = React.useState({ formatted_address: "1 rue de l'Ermitage" })

  const changeAddress = () => {
    Modal.hide('filters')
    Actions.addresses({ selected: address, onSelect: setAddress })
  }

  const onConfirm = () => {
    Modal.hide('filters')
  }

  return (
    <View style={{backgroundColor: mainStyle.themeColor}}>
      <View style={styles.header}>
        <MyText type='bold' style={styles.title}>{lang.FILTERS_TITLE}</MyText>
      </View>
      <View style={styles.content}>
        <View style={styles.group}>
          <MyText style={styles.groupTitle}>{lang.FILTERS_AROUND}</MyText>
          <TouchableOpacity style={styles.row} onPress={changeAddress}>
            <MyText style={styles.rowTitle}>{address.formatted_address}</MyText>
            <AntDesign name="right" color='#fff' />
          </TouchableOpacity>
        </View>
        <View style={styles.group}>
          <MyText style={styles.groupTitle}>{lang.FILTERS_RANGE}</MyText>
        </View>
      </View>
      <BottomButton
        title={lang.FILTERS_CONFIRM}
        titleColor={mainStyle.themeColor}
        backgroundColor={'#fff'}
        onPress={onConfirm}
        />
    </View>
  );
}

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
  content: {
    height: 300,
  },
  group: {

  },
  groupTitle: {
    fontSize: 15,
    color: '#fff',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
  },
  row: {
    marginVertical: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 16,

    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  rowTitle: {
    color: '#fff',
  }

});

export default FiltersModal