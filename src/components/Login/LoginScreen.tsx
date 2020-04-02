import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, SmallButton, PageLoader, CheckBox } from '../Reusable'
import { Fire, Flash } from '../../services'

import Icon from '@expo/vector-icons/FontAwesome'

import { saveName } from '../../actions/auth.action'
import { mainStyle } from '../../styles'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

const maxTitle = 60
const maxDescription = 255

interface Props {
  saveName: (name: any) => void;
}
interface State {
  user: any;
  registering: boolean;
  loading: boolean;
  forgotten: boolean;
  sending: boolean;
  checked: boolean;
}

class LoginScreen extends React.Component<Props, State>  {
  
  state = {
    user: {
      email: '',//swag1@gmail.com',
      password: '',//coucou123',
      confirm: '',//coucou123',
      first_name: '',//Julien',
      last_name: '',//Brunet',
    },
    checked: false,
    registering: true,
    loading: false,
    forgotten: false,
    sending: false
  }

  onChange(key: string, value: string) {
    const { user } = this.state
    user[key] = value
    this.setState({ user })
  }

  async proceed() {
    const { user, registering, checked } = this.state

    if (user.email === '' ||
      user.password === '') {
      Flash.error('Veuillez remplir tous les champs SVP')
      return;
    }
    if (registering) {
      if (user.first_name === '' || user.last_name === '') {
        Flash.error('Veuillez remplir tous les champs SVP')
        return;
      }
      if (user.password !== user.confirm) {
        Flash.error('Les mots de passes ne correspondent pas')
        return;
      }
      if (!checked) {
        Flash.error("Vous devez lire et accepter nos conditoins d'utilisation")
        return;
      }
    }

    const email = user.email
    const password = user.password

    this.setState({ loading: true })
    try {
      if (registering) {
        this.props.saveName({ first_name: user.first_name, last_name: user.last_name })
        await Fire.auth().createUserWithEmailAndPassword(email, password)
      }
      else
        await Fire.auth().signInWithEmailAndPassword(email, password)

    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          Flash.error('Le mail entré est invalide')
          break;

        case "auth/user-not-found":
          Flash.error("Cet utilisateur n'existe pas")
          break;
        
        case "auth/wrong-password":
          Flash.error('Mot de passe incorrect')
          break;

        case "auth/email-already-in-use":
          Flash.error('Le mail entré est déjà utilisé')
          break;

        case "auth/weak-password":
          Flash.error('Le mot de passe est trop faible (6 minimum)')
          break;

        default:
          Flash.error('Vérifiez votre connexion internet')
          break;
      }
    }
    this.setState({ loading: false })
  }

  async forgotPassword() {
    const { user } = this.state
    this.setState({ sending: true })
    try {
      await Fire.auth().sendPasswordResetEmail(user.email)
      Flash.show('Mail envoyé à ' + user.email)
      this.setState({ forgotten: false })
    } catch (err) {
      Flash.error('Mail entré incorrect')
    }
    this.setState({ sending: false })
  }

  render() {
    const { user, registering, loading, forgotten } = this.state
    return (
      <View style={styles.container}>
        <HeaderBar
          title={forgotten ? 'Mot de passe oublié' : registering ? 'Inscription' : 'Connexion'}
          back
          />
        <KeyboardAwareScrollView>
          <TitledInput
            title={'Entrez votre email'}
            value={user.email}
            placeholder='exemple@allisgood.fr'
            maxLength={maxTitle}
            autocorrect={false}

            onChange={({ nativeEvent }) => this.onChange('email', nativeEvent.text)}
            />

          { !forgotten &&
            <TitledInput
              secure
              title={'Choisir un mot de passe'}
              value={user.password}
              placeholder='**********'
              maxLength={maxTitle}
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('password', nativeEvent.text)}
              />
          }

          { registering &&
            <View>
              <TitledInput
                secure
                title={'Répéter le mot de passe'}
                value={user.confirm}
                placeholder='**********'
                maxLength={maxTitle}
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('confirm', nativeEvent.text)}
                />
              <TitledInput
                title={'Votre prénom'}
                value={user.first_name}
                placeholder='ex: Marie'
                maxLength={maxTitle}
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('first_name', nativeEvent.text)}
                />
              <TitledInput
                title={'Votre nom'}
                value={user.last_name}
                placeholder='ex: Dupont'
                maxLength={maxTitle}
                autocorrect={false}

                onChange={({ nativeEvent }) => this.onChange('last_name', nativeEvent.text)}
                />

              <CheckBox
                active={this.state.checked}
                title="En vous inscrivant, vous acceptez les conditions d'utilisation"
                onPress={() => this.setState({checked: !this.state.checked})}
                />
             </View>
           }

          <View style={{paddingTop: 20, paddingBottom: 22, alignItems: 'center'}}>
            { !forgotten ? (
              <SmallButton
                title={registering ? "C'est parti !" : "C'est parti !"}
                onPress={() => this.proceed()}
                />
            ) : (
              <SmallButton
                title={'Changer mon mot de passe'}
                onPress={() => this.forgotPassword()}
                />
            )}
          </View>

          <View style={styles.switcher}>
            { !registering &&
              <TouchableOpacity onPress={() => this.setState({ forgotten: !forgotten })}>
                <Text style={styles.switcherTxt}>{forgotten ? 'Je connais mon mot de passe' : 'Mot de passe oublié ?'}</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => this.setState({registering: !registering})}>
              <Text style={styles.switcherTxt}>{registering ? 'Vous avez déjà un compte ?' : 'Pas encore inscrit ?'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        <PageLoader
          title={registering ? 'Validation...' : 'Vérification...'}
          loading={loading || this.state.sending}
          />
      </View>
    );
  }
}

// @refresh reset
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

const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({
  saveName: (name: any) => dispatch(saveName(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
