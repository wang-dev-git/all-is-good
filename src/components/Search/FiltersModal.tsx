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

}
const FiltersModal: React.FC<Props> = (props) => {
  
  return (
    <View style={{backgroundColor: mainStyle.themeColor}}>
      <View style={styles.header}>
        <Text style={styles.title}>Filtres</Text>
      </View>
      <View style={styles.center}>

      </View>
      <BottomButton
        title='Confirmer'
        titleColor={mainStyle.themeColor}
        backgroundColor={'#fff'}
        onPress={() => Modal.hide('filters')}
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
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
    textTransform: 'uppercase',
  },
  open: {
    ...mainStyle.montLight,
    textAlign: 'center',
    marginTop: 6,
    color: '#fff',
  },
  center: {
    height: 200,
    alignItems: 'center',
  },
  icon: {
    ...mainStyle.circle(68),
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...mainStyle.montLight,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 60,
    color: '#fff',
  },

});

export default FiltersModal