import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, PageLoader } from '../Reusable'
import { Fire, Flash } from '../../services'

import { Actions } from 'react-native-router-flux'

import Icon from '@expo/vector-icons/FontAwesome'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

import { updateUser} from '../../actions/auth.action'
import { mainStyle } from '../../styles'

const maxTitle = 60
const maxDescription = 255

type Props = {
  user: any;
  loading: boolean;

  updateUser: (info: any) => void;
}
type State = {
  info: any;
}

class UserInfoScreen extends React.Component<Props, State>  {
  
  constructor(props) {
    super(props)

    this.state = {
      info: props.user,
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
    const { updateUser } = this.props
    const { info } = this.state

    try {
      await updateUser(info)
      Actions.pop()
    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }

  render() {
    const { user, loading } = this.props
    const { info } = this.state
    return (
      <View style={styles.container}>
        <HeaderBar
          title='Mes Coordonnées'
          back
          />
        <KeyboardAwareScrollView>
          <TitledInput
            title={'E-mail'}
            value={info.email}
            placeholder='exemple@isclothing.fr'
            maxLength={maxTitle}
            autocorrect={false}

            editable={false}
            onChange={({ nativeEvent }) => this.onChange('email', nativeEvent.text)}
            />

          <TitledInput
            title={'Prénom'}
            value={info.first_name}
            placeholder='ex: Marie'
            maxLength={maxTitle}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('first_name', nativeEvent.text)}
            />
          <TitledInput
            title={'Nom'}
            value={info.last_name}
            placeholder='ex: Dupont'
            maxLength={maxTitle}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('last_name', nativeEvent.text)}
            />

          {/* Save Button */}
          <View>
            <BottomButton
              style={{marginTop: 24}}
              title={'Enregistrer'}
              backgroundColor={mainStyle.themeColor}

              onPress={() => this.save()}
              />
          </View>
        </KeyboardAwareScrollView>

        <PageLoader
          title={'Validation...'}
          loading={loading}
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
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  loading: state.authReducer.updating,
})
const mapDispatchToProps = (dispatch: any) => ({
  updateUser: (info: any) => dispatch(updateUser(info)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoScreen)
