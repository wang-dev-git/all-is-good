import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, MyText, BottomButton, SmallButton, PageLoader, CheckBox } from '../Reusable'
import { Fire, Flash, AppConfig } from '../../services'

import { Actions } from 'react-native-router-flux'

import { saveName } from '../../actions/auth.action'
import { mainStyle } from '../../styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

interface Props {
  lang: any;

  saveName: (name: any) => void;
}
interface State {
  user: any;
  registering: boolean;
  loading: boolean;
  sending: boolean;
  checked: boolean;
}

class LoginScreen extends React.Component<Props, State>  {

  state = {
    user: {
      email: AppConfig.isProd() ? '' : 'julien.brunet.92@gmail.com',
      password: AppConfig.isProd() ? '' : 'coucou123',
      confirm: AppConfig.isProd() ? '' : 'coucou123',
      first_name: AppConfig.isProd() ? '' : 'Julien',
      last_name: AppConfig.isProd() ? '' : 'Brunet',
      phone: AppConfig.isProd() ? '' : '0642986844',
    },
    checked: false,
    registering: true,
    loading: false,
    sending: false
  }

  onChange(key: string, value: string) {
    const { user } = this.state
    user[key] = value
    this.setState({ user })
  }

  async proceed() {
    const { lang } = this.props
    const { user, registering, checked } = this.state

    const email = user.email.trim()

    if (email === '' ||
      user.password === '') {
      Flash.error(lang.LOGIN_ERR_ALL_FIELDS)
      return;
    }
    if (registering) {
      if (user.first_name === '' || user.last_name === '') {
        Flash.error(lang.LOGIN_ERR_ALL_FIELDS)
        return;
      }
      if (user.password !== user.confirm) {
        Flash.error(lang.LOGIN_ERR_CONFIRM_PASSWORD)
        return;
      }
      if (!checked) {
        Flash.error(lang.LOGIN_ERR_CONDITIONS)
        return;
      }
    }

    const password = user.password

    this.setState({ loading: true })
    try {
      if (registering) {
        this.props.saveName({ email: email, first_name: user.first_name, last_name: user.last_name, phone: user.phone || '' })
        await Fire.auth().createUserWithEmailAndPassword(email, password)
      }
      else {
        await Fire.auth().signInWithEmailAndPassword(email, password)
        Actions.push('root')
      }
    } catch (err) {
      console.log(err)
      switch (err.code) {
        case "auth/invalid-email":
          Flash.error(lang.LOGIN_ERR_INVALID_EMAIL)
          break;

        case "auth/user-not-found":
          Flash.error(lang.LOGIN_ERR_USER_NOT_FOUND)
          break;

        case "auth/wrong-password":
          Flash.error(lang.LOGIN_ERR_WRONG_PASSWORD)
          break;

        case "auth/email-already-in-use":
          Flash.error(lang.LOGIN_ERR_ALREADY_REGISTERED)
          break;

        case "auth/weak-password":
          Flash.error(lang.LOGIN_ERR_WEAK_PASSWORD)
          break;

        default:
          Flash.error(lang.GLOBAL_INTERNET)
          break;
      }
    }
    this.setState({ loading: false })
  }

  render() {
    const { lang } = this.props
    const { user, registering, loading } = this.state

    return (
      <View style={styles.container}>
        <HeaderBar
          title={registering ? lang.LOGIN_REGISTER_TITLE : lang.LOGIN_TITLE}
          back
        />
        <KeyboardAwareScrollView>

          <MyText type='bold' style={styles.welcome}>{registering ? lang.LOGIN_REGISTER_MESSAGE : lang.LOGIN_MESSAGE}</MyText>

          <TitledInput
            title={lang.LOGIN_EMAIL}
            value={user.email}
            placeholder={lang.LOGIN_EMAIL_PLACEHODLER}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('email', nativeEvent.text)}
          />

          <TitledInput
            secure
            title={lang.LOGIN_PASSWORD}
            value={user.password}
            placeholder='**********'
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('password', nativeEvent.text)}
          />

          {registering &&
            <View>
              <TitledInput
                secure
                title={lang.LOGIN_CONFIRM_PASSWORD}
                value={user.confirm}
                placeholder='**********'
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('confirm', nativeEvent.text)}
              />
              <TitledInput
                title={lang.LOGIN_FIRST_NAME}
                value={user.first_name}
                placeholder={lang.LOGIN_FIRST_NAME_PLACEHOLDER}
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('first_name', nativeEvent.text)}
              />
              <TitledInput
                title={lang.LOGIN_LAST_NAME}
                value={user.last_name}
                placeholder={lang.LOGIN_LAST_NAME_PLACEHOLDER}
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('last_name', nativeEvent.text)}
              />
              <TitledInput
                title={lang.LOGIN_PHONE + ' (' + lang.GLOBAL_OPTIONAL + ')'}
                value={user.phone}
                placeholder={lang.LOGIN_PHONE_PLACEHOLDER}
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('phone', nativeEvent.text)}
              />

              <CheckBox
                active={this.state.checked}
                title={lang.LOGIN_CONDITIONS}
                onPress={() => this.setState({ checked: !this.state.checked })}
                onTapText={() => Linking.openURL('https://allisgood-app.com/terms')}
              />
            </View>
          }

          <View style={{ paddingTop: 20, paddingBottom: 12, alignItems: 'center' }}>
            <SmallButton
              title={lang.LOGIN_BTN_TXT}
              onPress={() => this.proceed()}
            />
          </View>

          <View style={styles.switcher}>
            {!registering &&
              <TouchableOpacity onPress={Actions.forgot}>
                <MyText style={styles.switcherTxt}>{lang.LOGIN_FORGOT_PASSWORD}</MyText>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => this.setState({ registering: !registering })}>
              <MyText style={styles.switcherTxt}>{registering ? lang.LOGIN_ALREADY_REGISTERED : lang.LOGIN_NOT_REGISTERED}</MyText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        <PageLoader
          title={lang.GLOBAL_LOADING}
          loading={loading || this.state.sending}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcome: {
    marginTop: 32,
    marginBottom: 10,
    textAlign: 'center',
    color: mainStyle.themeColor,
    fontSize: 23,
    textTransform: 'uppercase',
    paddingHorizontal: 30,
  },
  switcher: {
    marginTop: 0,
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

const mapStateToProps = (state: any) => ({
  lang: state.langReducer.lang,
})
const mapDispatchToProps = (dispatch: any) => ({
  saveName: (name: any) => dispatch(saveName(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
