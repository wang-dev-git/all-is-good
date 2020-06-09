import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, Animated, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import AssetImage from './AssetImage'
import BottomButton from './BottomButton'
import SmallButton from './SmallButton'
import MyText from './MyText'
import { Fire, Flash, Modal } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

import { switchTab, switchOrderTab } from '../../actions/tab.action'

interface Props {

}

const EmailVerifModal: React.FC<Props> = (props) => {
  const user = useSelector(state => state.authReducer.user)
  const lang = useSelector(state => state.langReducer.lang)

  const resend = async () => {
    try {
      await Fire.resendMail()
      Flash.show((lang.FORGOT_MAIL_SENT || '').replace('%EMAIL%', user.email))
      Modal.hide('email_validation')
    } catch (err) {

    }
              
  }

  return (
    <View>
      <View style={styles.header}>
        <MyText style={styles.title}>{lang.PRO_EMAIL_VERIF_TITLE}</MyText>
        <MyText style={styles.open}>{lang.PRO_EMAIL_VERIF_SUBTITLE}</MyText>
      </View>
      <View style={styles.center}>
        <View style={[styles.icon, {backgroundColor: props.success ? mainStyle.themeColor : mainStyle.redColor}]}>
          <AntDesign name={props.success ? 'check' : 'close'} size={38} color='#fff' />
        </View>
        <MyText style={styles.message}>{(lang.PRO_EMAIL_VERIF_MSG || '').replace('%EMAIL%', user.email)}</MyText>

        <View style={{alignItems: 'center', marginBottom: 20,}}>
          <SmallButton
            title={lang.PRO_EMAIL_VERIF_RESEND}
            onPress={resend}
            />
        </View>
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },

});

export default EmailVerifModal