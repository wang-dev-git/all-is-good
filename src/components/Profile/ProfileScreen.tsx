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

    return (
      <View style={styles.container}>
        <HeaderBar
          title='Mon profil'
          />
        
        <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 40}}>
          
          <View style={styles.userInfo}>
            <View style={styles.pictureWrapper}>
              <TouchableOpacity onPress={() => this.editPicture()} style={styles.picture}>
                <AssetImage
                  src={userPicture}
                  resizeMode='cover'
                  style={[mainStyle.abs, { transform: [{ scale: 1.7 }] }]}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.editPicture()} style={styles.editPicture}>
                <Icon name="edit" size={16} color='#fff' />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.first_name + ' ' + user.last_name}</Text>
            <TouchableOpacity onPress={Actions.profile}>
              <Text style={styles.userEdit}>Modifier</Text>            
            </TouchableOpacity>
          </View>

          <View style={styles.group}>
            <MenuLink
              icon='ticket'
              title='Réservations'
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
              iconSize={16}
              title='Mes moyens de paiement'
              right

              onPress={Actions.creditCards}
              />

            <MenuLink
              icon='headphones'
              title="Assistance"
              right
              
              onPress={() => this.help()}
              />
            <MenuLink
              icon='star'
              iconSize={16}
              title={'Notez l\'application'}
              right

              onPress={() => this.appStore()}
              />
           </View>

           <View style={[styles.group, { marginTop: 40 }]}>
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
    flexDirection: 'column',
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
    ...mainStyle.circle(100),
    borderWidth: 1,
    borderColor: '#E3E4EE'
  },
  editPicture: {
    ...mainStyle.circle(30),
    backgroundColor: mainStyle.themeColor,

    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    top: 10,
    right: 10,
  },
  userName: {
    ...mainStyle.montLight,
    marginTop: 10,
    fontSize: 22,
    color: '#333',
    textAlign: 'center',
  },
  userEdit: {
    ...mainStyle.montBold,
    marginTop: 5,
    color: mainStyle.themeColor,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 1.2
  },
  group: {
    borderTopWidth: 1,
    borderTopColor: '#E3E4EE',
    marginTop: 20,
  },
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({
  updateUser: (info: any) => dispatch(updateUser(info)),
  clearCards: () => dispatch(clearCards()),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

