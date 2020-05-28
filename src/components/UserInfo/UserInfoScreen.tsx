import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, SmallButton } from '../Reusable'
import { Fire, Flash, Loader } from '../../services'

import { Actions } from 'react-native-router-flux'

import Icon from '@expo/vector-icons/FontAwesome'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

import { updateUser} from '../../actions/auth.action'
import { mainStyle } from '../../styles'

const maxTitle = 60
const maxDescription = 255

type Props = {
  user: any;
  lang: any;

  updateUser: (info: any) => void;
}
type State = {
  info: any;
}

class UserInfoScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      info: { ...props.user },
    }
  }

  onChange(key: string, value: string) {
    const { info } = this.state
    if (key === 'phone' && value.length > 10)
      return;
    info[key] = value
    this.setState({ info })
  }

  async save() {
    const { lang } = this.props
    const { updateUser } = this.props
    const { info } = this.state

    Loader.show(lang.GLOBAL_SAVING)
    try {
      await updateUser(info)
      Actions.pop()
    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
    Loader.hide()
  }

  render() {
    const { user, lang } = this.props
    const { info } = this.state
    return (
      <View style={styles.container}>
        <HeaderBar
          title={lang.USER_INFO_TITLE}
          back
          />
        <KeyboardAwareScrollView>
          <TitledInput
            title={lang.USER_INFO_EMAIL}
            value={info.email}
            placeholder={lang.LOGIN_EMAIL_PLACEHOLDER}
            maxLength={maxTitle}
            autocorrect={false}

            editable={false}
            onChange={({ nativeEvent }) => this.onChange('email', nativeEvent.text)}
            />

          <TitledInput
            title={lang.USER_INFO_FIRST_NAME}
            value={info.first_name}
            placeholder={lang.LOGIN_FIRST_NAME_PLACEHOLDER}
            maxLength={maxTitle}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('first_name', nativeEvent.text)}
            />
          <TitledInput
            title={lang.USER_INFO_LAST_NAME}
            value={info.last_name}
            placeholder={lang.LOGIN_LAST_NAME_PLACEHOLDER}
            maxLength={maxTitle}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('last_name', nativeEvent.text)}
            />
          <TitledInput
            title={lang.USER_INFO_PHONE}
            value={info.phone}
            placeholder={lang.LOGIN_PHONE_PLACEHOLDER}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('phone', nativeEvent.text)}
            />

          {/* Save Button */}
          <View style={{alignItems: 'center', paddingTop: 20}}>
            <SmallButton
              title={lang.GLOBAL_SAVE}
              onPress={() => this.save()}
              />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  lang: state.langReducer.lang,
})
const mapDispatchToProps = (dispatch: any) => ({
  updateUser: (info: any) => dispatch(updateUser(info)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoScreen)
