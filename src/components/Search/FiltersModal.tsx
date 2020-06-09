import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Text, Animated, View, Slider, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { AssetImage, BottomButton, SelectCreditCard, MyText } from '../Reusable'
import { Fire, Flash, Modal, Loader, Tools } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'
import { updateUser, updatePosition } from '../../actions/auth.action'

const min = 5
const max = 50
const step = 15

interface Props {
}
const FiltersModal: React.FC<Props> = (props) => {
  
  const user = useSelector(state => state.authReducer.user)
  const lang = useSelector(state => state.langReducer.lang)
  const langId = useSelector(state => state.langReducer.id)
  const position = useSelector(state => state.authReducer.position)
  const [distance, setDistance] = React.useState(user && user.distance ? user.distance : max)
  const dispatch = useDispatch()

  const changeAddress = () => {
    Modal.hide('filters')
    Actions.addresses({
      title: lang.ADDRESSES_TITLE,
      selected: position,
      onSelect: (pos) => {
        dispatch(updatePosition(pos))
     }
   })
  }

  const onConfirm = async () => {
    if (user.distance !== distance) {
      Loader.show(lang.GLOBAL_LOADING)
      try {
        await dispatch(updateUser({ distance: distance }))
        Modal.hide('filters')
      } catch (err) {

      }
      Loader.hide()
    } else {
      Modal.hide('filters')
    }
  }

  return (
    <View style={{backgroundColor: mainStyle.themeColor}}>
      <View style={styles.header}>
        <MyText type='bold' style={styles.title}>{lang.FILTERS_TITLE}</MyText>
      </View>
      <View style={styles.content}>
        <View style={styles.group}>
          <MyText type='bold' style={styles.groupTitle}>{lang.FILTERS_AROUND}</MyText>
          <TouchableOpacity style={styles.row} onPress={changeAddress}>
            <MyText style={styles.rowTitle}>{position ? position.formatted_address : lang.FILTERS_NO_ADDRESS}</MyText>
            <AntDesign name="right" color='#fff' />
          </TouchableOpacity>
        </View>
        <View style={styles.group}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MyText type='bold' style={styles.groupTitle}>{lang.FILTERS_RANGE}</MyText>
            <MyText type='bold' style={{ color: '#fff', marginRight: 16 }}>{Tools.showBrutDistance(distance, langId, 0)}</MyText>
          </View>
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Slider
              minimumValue={min}
              maximumValue={max}
              value={distance}
              minimumTrackTintColor={'#ded'}
              maximumTrackTintColor={'#fff'}
              onValueChange={setDistance}
              />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <MyText style={{ color: '#fff' }}>{Tools.showBrutDistance(min, langId, 0)}</MyText>
              <MyText style={{ color: '#fff' }}>{Tools.showBrutDistance(max, langId, 0)}</MyText>
            </View>
          </View>
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
    marginTop: 2,
    marginBottom: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,

    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  rowTitle: {
    color: '#fff',
  }

});

export default FiltersModal