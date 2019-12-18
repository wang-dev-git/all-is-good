import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux'

import { HeaderBar, AssetImage, BottomButton, VeilView, PageLoader } from '../Reusable'
import { Fire, Flash } from '../../services'

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';
import Icon from '@expo/vector-icons/Entypo'

import MenuLink from './MenuLink'
import { updateUser } from '../../actions/auth.action'
import { clearCards } from '../../actions/cards.action'

import { mainStyle } from '../../styles'

type Props = {
  user: any;

  updateUser: (info: any) => void;
  clearCards: () => void;
}
type State = {
  uploading: boolean;
}

class ProfileScreen extends React.Component<Props, State>  {
  
  state = {
    uploading: false,
  }

  componentDidMount() {
    //setTimeout(() => Actions.creditCards(), 200)
  }

  logout() {
    this.props.clearCards()
    Actions.pop()
    Fire.auth().signOut()
  }

  async editPicture() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted')
      await Permissions.askAsync(Permissions.CAMERA_ROLL)

    try {
      const result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 3],
      });

      if (!result.cancelled) {
        const { user, updateUser } = this.props

        const uri = result.uri
        const location = 'images/users/' + user.id + '/profile_picture.png'
        
        this.setState({ uploading: true })
        const uploadedURL = await Fire.uploadFile(location, uri)

        try {
          await updateUser({picture: uploadedURL})
          Flash.show('Photo enregistrée !')
        } catch (err) {
          Flash.error('Une erreur est survenue')
        }
        this.setState({ uploading: false })
      }

    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }

  async editBackground() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted')
      await Permissions.askAsync(Permissions.CAMERA_ROLL)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 3],
      });

      if (!result.cancelled) {
        const { user, updateUser } = this.props

        const uri = result.uri
        const location = 'images/users/' + user.id + '/background_picture.png'
        
        this.setState({ uploading: true })
        const uploadedURL = await Fire.uploadFile(location, uri)

        try {
          await updateUser({background: uploadedURL})
          Flash.show('Photo enregistrée !')
        } catch (err) {
          Flash.error('Une erreur est survenue')
        }
        this.setState({ uploading: false })
      }

    } catch (err) {
      Flash.error('Une erreur est survenue')
      console.log(err)
    }
  }

  appStore() {
    Linking.openURL('https://apps.apple.com/fr/app/isclothing/id1481450876?ls=1')
  }

  async help() {
    Alert.alert(
      'Assistance',
      'En demandant à rentrer en contact avec IsClothing, vous acceptez de continuer vos échanges via la boite mail renseignée lors de la création de votre compte',
      [
        {
          text: 'Annuler',
          onPress: () => void 0,
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
          this.showMail()
        }},
      ],
      {cancelable: false},
    );
  }

  async showMail() {
    try {
      const res = await MailComposer.composeAsync({
        recipients: ['contact@isclothing.fr'],
        subject: "Demande d'assistance IsClothing",
        body: '',
        isHtml: false,
      })
      console.log(res)
    } catch (err) {
      alert("Veuillez envoyer un mail à : contact@isclothing.fr")
    }
  }

  render() {
    const { user } = this.props
    const { uploading } = this.state

    if (!user) { return (null) }

    const userPicture = user.pictures && user.pictures.length ? {uri: user.pictures[0]} : require('../../images/user.png')
    const background = user.hasShop ? (user.background ? {uri: user.background} : require('../../images/shop-bg.png')) : userPicture

    return (
      <View style={styles.container}>
        <HeaderBar
          title={'Mon profil'}
          back
          />
        <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 40}}>
          <View style={styles.userInfo}>
            <AssetImage
              src={background}
              resizeMode='cover'
              style={[mainStyle.abs, { transform: [{ scale: 1.7 }] }]}
              />
            <VeilView abs start='rgba(12, 12, 12, 0.52)' end='rgba(12, 12, 12, 0.52)' />
            <View style={styles.pictureWrapper}>
              <TouchableOpacity onPress={() => this.editPicture()} style={styles.picture}>
                <AssetImage
                  src={userPicture}
                  resizeMode='cover'
                  style={[mainStyle.abs, { transform: [{ scale: 1.7 }] }]}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.editPicture()} style={styles.editPicture}>
                <Icon name="edit" size={20} color='#fff' />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.first_name}</Text>
            { user.hasShop &&
              <TouchableOpacity style={styles.addBackBtn} onPress={() => this.editBackground()}>
                <Text style={styles.addBackTxt}>{'Modifier la bannière'.toUpperCase()}</Text>
              </TouchableOpacity>
            }
          </View>

          <Text style={styles.groupTitle}>Acheteur</Text>

          <View style={styles.group}>
            <MenuLink
              icon='ticket'
              title='Mes Achats'
              right
              
              onPress={Actions.orders}
              />
            <MenuLink
              icon='id-card'
              title='Mes Coordonnées'
              right
              
              onPress={Actions.userInfo}
              />
            <MenuLink
              icon='credit-card-alt'
              iconSize={19}
              title='Mes moyens de paiement'
              right

              onPress={Actions.creditCards}
              />
           </View>

          <Text style={styles.groupTitle}>Vendeur</Text>

          <View style={styles.group}>
            <MenuLink
              icon='briefcase'
              title='Mon Wallet'
              right
              
              onPress={Actions.wallet}
              />
            <MenuLink
              icon='bank'
              iconSize={19}
              title='Mon compte vendeur'
              right

              onPress={Actions.userBank}
              />

            <MenuLink
              icon='line-chart'
              iconSize={19}
              title='Mes Ventes'
              right

              onPress={Actions.sales}
              />
            <MenuLink
              icon='shopping-bag'
              iconSize={19}
              title='Mes articles en ligne'
              right

              onPress={Actions.myProducts}
              />
           </View>

          <Text style={styles.groupTitle}>Mon application</Text>

          <View style={styles.group}>
            <MenuLink
              icon='headphones'
              title="Contacter IsClothing"
              right
              
              onPress={() => this.help()}
              />
            <MenuLink
              icon='star'
              iconSize={19}
              title={'Notez l\'application'}
              right

              onPress={() => this.appStore()}
              />
           </View>

           <View style={[styles.group, { marginTop: 60 }]}>
            <MenuLink
              icon='sign-out'
              title='Déconnexion'

              onPress={() => this.logout()}
              />
           </View>
        </ScrollView>
        <PageLoader
          title='Validation...'
          loading={uploading}
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
  content: {
    flex: 1,
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingVertical: 20,
  },
  pictureWrapper: {
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  picture: {
    ...mainStyle.circle(120),
  },
  editPicture: {
    ...mainStyle.circle(46),
    backgroundColor: mainStyle.themeColor,

    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    top: 0,
    right: 0,
  },
  userName: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  groupTitle: {
    marginLeft: 24,
    color: '#333',
    fontSize: 20,
    marginTop: 40,
  },
  group: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 20,
  },

  addBackBtn: {
    height: 38,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
  },
  addBackTxt: {
    ...mainStyle.montLight,
    fontSize: 13,
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({
  updateUser: (info: any) => dispatch(updateUser(info)),
  clearCards: () => dispatch(clearCards()),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

