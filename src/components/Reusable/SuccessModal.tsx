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
  message: string;
  subtitle: string
  success: boolean;
}

const SuccessModal: React.FC<Props> = (props) => {
  
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Confirmation</Text>
        <Text style={styles.open}>{props.subtitle}</Text>
      </View>
      <View style={styles.center}>
        <View style={[styles.icon, {backgroundColor: props.success ? mainStyle.themeColor : mainStyle.redColor}]}>
          <AntDesign name={props.success ? 'check' : 'close'} size={38} color='#fff' />
        </View>
        <Text style={styles.message}>{props.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  header: {
    margin: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    borderBottomColor: '#eee',
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
  center: {
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
  },

});

export default SuccessModal