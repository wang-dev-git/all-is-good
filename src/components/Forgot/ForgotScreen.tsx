import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, SmallButton, CheckBox } from '../Reusable'
import { Fire, Flash, Loader } from '../../services'

import { Actions } from 'react-native-router-flux'
import Icon from '@expo/vector-icons/FontAwesome'

import { mainStyle } from '../../styles'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

const maxTitle = 60
const maxDescription = 255

interface Props {
}
const ForgotScreen: React.FC<Props> = (props) => {
  
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState('')
  const lang = useSelector(state => state.langReducer.lang)

  const forgotPassword = async () => {
    Loader.show(lang.GLOBAL_SENDING)
    try {
      await Fire.auth().sendPasswordResetEmail(email)
      Flash.show((lang.FORGOT_MAIL_SENT || '').replace('%EMAIL%', email))
      Actions.pop()
    } catch (err) {
      Flash.error(lang.FORGOT_MAIL_ERROR)
    }
    Loader.hide()
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title={lang.FORGOT_TITLE}
        back
        />
      <KeyboardAwareScrollView>
        <TitledInput
          title={lang.FORGOT_EMAIL}
          value={email}
          placeholder={lang.FORGOT_EMAIL_PLACEHOLDER}
          maxLength={maxTitle}
          autocorrect={false}

          onChange={({ nativeEvent }) => setEmail(nativeEvent.text)}
          />

        <View style={{paddingTop: 20, paddingBottom: 22, alignItems: 'center'}}>
          <SmallButton
            title={lang.FORGOT_CHANGE_BTN}
            onPress={forgotPassword}
            />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  switcher: {
    marginTop: 10,
    paddingBottom: mainStyle.phonePaddingBottom + 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherTxt: {
    ...mainStyle.montText,
    fontSize: 16,
    color: 'rgb(100, 100, 222)',
    textAlign: 'center',
    marginBottom: 22,
  },
  outro: {
    marginTop: 12,
    paddingHorizontal: 25,
    lineHeight: 26,
    textAlign: 'center',
    color: mainStyle.lightColor
  },
});

export default ForgotScreen