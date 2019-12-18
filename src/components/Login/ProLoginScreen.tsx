import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, BottomButton, PageLoader } from '../Reusable'
import { Fire, Flash } from '../../services'

import Icon from '@expo/vector-icons/FontAwesome'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

import { saveName } from '../../actions/auth.action'
import { mainStyle } from '../../styles'

const maxTitle = 60
const maxDescription = 255

interface Props {
  saveName: (name: any) => void;
}
interface State {
  user: any;
  registering: boolean;
  loading: boolean;

}

class ProLoginScreen extends React.Component<Props, State>  {
  
  state = {
    user: {
      email: '',//'julien1@shop.fr',
      password: '',//'coucou123',
      confirm: '',//'coucou123',
      last_name: '',//'Brunet',
      first_name: '',//'Julien',
      company: '',//'Nabilla International',
      shop: '',//'NabiShop',
      siret: '',//'362 521 879 00034',
    },
    registering: false,
    loading: false,
  }

  onChange(key: string, value: string) {
    const { user } = this.state
    user[key] = value
    this.setState({ user })
  }

  async proceed() {
    const { user, registering } = this.state

    const email = user.email
    const password = user.password

    this.setState({ loading: true })
    try {
      if (registering) {
        this.props.saveName({
          email: email,
          siret: user.siret,
          first_name: user.first_name,
          last_name: user.last_name,
          company: user.company,
          shop: user.shop,
        })
        await Fire.auth().createUserWithEmailAndPassword(email, password)
      }
      else
        await Fire.auth().signInWithEmailAndPassword(email, password)

    } catch (err) {
      Flash.error(err.message)
    }
    this.setState({ loading: false })
  }

  render() {
    const { user, registering, loading } = this.state
    return (
      <View style={styles.container}>
        <HeaderBar
          title='Créer ma boutique'
          back
          />
        <KeyboardAwareScrollView>
            <TitledInput
              title={'E-mail'}
              value={user.email}
              placeholder='exemple@isclothing.fr'
              maxLength={maxTitle}
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('email', nativeEvent.text)}
              />
            <TitledInput
              secure
              title={'Mot de passe'}
              value={user.password}
              placeholder='**********'
              maxLength={maxTitle}
              autocorrect={false}

              onChange={({ nativeEvent }) => this.onChange('password', nativeEvent.text)}
              />

            { registering &&
              <View>
                <TitledInput
                  secure
                  title={'Confirmez le Mot de passe'}
                  value={user.confirm}
                  placeholder='**********'
                  maxLength={maxTitle}
                  autocorrect={false}

                  onChange={({ nativeEvent }) => this.onChange('confirm', nativeEvent.text)}
                  />
                <TitledInput
                  title={'Nom du gérant'}
                  value={user.last_name}
                  placeholder='ex: Dupont'
                  maxLength={maxTitle}
                  autocorrect={false}

                  onChange={({ nativeEvent }) => this.onChange('last_name', nativeEvent.text)}
                  />
                <TitledInput
                  title={'Prénom du gérant'}
                  value={user.first_name}
                  placeholder='ex: Marie'
                  maxLength={maxTitle}
                  autocorrect={false}

                  onChange={({ nativeEvent }) => this.onChange('first_name', nativeEvent.text)}
                  />
                <TitledInput
                  title={'Nom de l\'entreprise'}
                  value={user.company}
                  placeholder='ex: Dupont'
                  maxLength={maxTitle}
                  autocorrect={false}

                  onChange={({ nativeEvent }) => this.onChange('company', nativeEvent.text)}
                  />
                <TitledInput
                  title={'Nom de ma boutique'}
                  value={user.shop}
                  placeholder='ex: Dupont'
                  maxLength={maxTitle}
                  autocorrect={false}

                  onChange={({ nativeEvent }) => this.onChange('shop', nativeEvent.text)}
                  />
                <TitledInput
                  title={'SIRET'}
                  value={user.siret}
                  placeholder='ex: 362 521 879 00034'
                  maxLength={maxTitle}
                  autocorrect={false}

                  onChange={({ nativeEvent }) => this.onChange('siret', nativeEvent.text)}
                  />

                <Text style={styles.outro}>Nous ne traiterons vos données que dans la mesure où cela est nécessaire pour créer et gérer
                votre accès à nos services en ligne. Vos données ne sauraient être conservées après la
                fermeture de votre compte.</Text>
               </View>
             }

            <View style={styles.switcher}>
              <TouchableOpacity onPress={() => this.setState({registering: !registering})}>
                <Text style={styles.switcherTxt}>{registering ? 'Vous avez déjà un compte ?' : 'Pas encore inscrit ?'}</Text>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <View style={{paddingTop: 40}}>
              <BottomButton
                title={registering ? 'M\'inscrire' : 'Me connecter'}
                backgroundColor={mainStyle.themeColor}

                onPress={() => this.proceed()}
                />
            </View>
          </KeyboardAwareScrollView>

        <PageLoader
          title={registering ? 'Validation...' : 'Vérification...'}
          loading={loading}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switcher: {
    marginTop: 20,
  },
  switcherTxt: {
    textAlign: 'center',
    color: 'rgb(100, 100, 222)',
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

export default connect(mapStateToProps, mapDispatchToProps)(ProLoginScreen)
