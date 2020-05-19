import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux'

import { HeaderBar, MyText , AssetImage, BottomButton, VeilView, PageLoader, SmallButton } from '../Reusable'
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
  lang: any;

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
    const { lang } = this.props
    Alert.alert(
      lang.PROFILE_LOGOUT,
      lang.PROFILE_LOGOUT_CONFIRM,
      [
        {
          text: lang.GLOBAL_CANCEL,
          onPress: () => void 0,
          style: 'cancel',
        },
        {text: lang.GLOBAL_OK, onPress: () => {
          this.props.clearCards()
          Actions.pop()
          Fire.auth().signOut()
        }},
      ],
    );
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
          await updateUser({pictures: [uploadedURL]})
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
    Linking.openURL('https://google.fr')
  }

  showInsta() {
    Linking.openURL('https://www.instagram.com/allisgood.app/')
  }

  showFacebook() {
    Linking.openURL('https://www.facebook.com/AllisGoodApp')
  }

  showTwitter() {
    Linking.openURL('https://twitter.com/AllisGo03643362')
  }

  async help() {
    const { lang } = this.props
    Alert.alert(
      lang.PROFILE_HELP,
      lang.PROFILE_HELP_MSG,
      [
        {
          text: lang.GLOBAL_CANCEL,
          onPress: () => void 0,
          style: 'cancel',
        },
        {text: lang.PROFILE_HELP_BTN, onPress: () => {
          Linking.openURL('https://allisgood-app.com/contact-us/')
          //this.showMail()
        }},
      ],
      {cancelable: false},
    );
  }

  async showMail() {
    try {
      const res = await MailComposer.composeAsync({
        recipients: ['contact@allisgood.fr'],
        subject: "Demande d'assistance All Is Good",
        body: '',
        isHtml: false,
      })
    } catch (err) {
      alert("Veuillez envoyer un mail à : contact@allisgood.fr")
    }
  }

  becomePro() {
    Linking.openURL('https://allisgood-app.com/become-partner/')
  }

  render() {
    const { user, lang } = this.props
    const { uploading } = this.state

    if (!user) { return (null) }

    const userPicture = user.pictures && user.pictures.length ? {uri: user.pictures[0]} : require('../../images/noimage.png')

    return (
      <View style={styles.container}>
        <HeaderBar
          logo
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
            <MyText style={styles.userName}>{user.first_name + ' ' + user.last_name}</MyText>
            <TouchableOpacity onPress={Actions.userInfo}>
              <MyText style={styles.userEdit}>{this.props.lang.PROFILE_EDIT_BTN}</MyText>            
            </TouchableOpacity>
          </View>

          <View style={styles.group}>
            <MenuLink
              icon='id-card'
              title={lang.PROFILE_INFO}
              right
              
              onPress={Actions.userInfo}
              />
            <MenuLink
              icon='credit-card-alt'
              iconSize={16}
              title={lang.PROFILE_CARDS}
              right

              onPress={Actions.creditCards}
              />

            <MenuLink
              icon='headphones'
              title={lang.PROFILE_HELP}
              right
              
              onPress={() => this.help()}
              />
            {/*
            <MenuLink
              icon='star'
              iconSize={16}
              title={lang.PROFILE_RATING}
              right

              onPress={() => this.appStore()}
              />
            */}
            <MenuLink
              icon='cog'
              title={lang.PROFILE_SETTINGS}
              right
              
              onPress={Actions.settings}
              />
           </View>

           <View style={[styles.group, { marginTop: 40 }]}>
            <MenuLink
              icon='sign-out'
              title={lang.PROFILE_LOGOUT}

              onPress={() => this.logout()}
              />
           </View>

           <View style={styles.join}>
             <MyText style={styles.joinTxt}>{lang.PROFILE_JOIN_AIG}</MyText>
             {/*<TouchableOpacity onPress={() => this.becomePro()}>
               <MyText style={styles.joinLink}>En savoir plus...</MyText>
             </TouchableOpacity>*/}
             <View style={{alignItems: 'center', marginTop: 18,}}>
               <SmallButton
                 title={lang.PROFILE_JOIN_AIG_BTN}
                 onPress={() => this.becomePro()}
                 />
             </View>
           </View>

           <View style={[styles.nets]}>
             <TouchableOpacity style={styles.net} onPress={() => this.showInsta()}>
               <AssetImage src={require('../../images/insta_logo.png')} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.net} onPress={() => this.showFacebook()}>
               <AssetImage src={require('../../images/fb_logo.png')} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.net} onPress={() => this.showTwitter()}>
               <AssetImage src={require('../../images/twitter_logo.png')} />
             </TouchableOpacity>
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
    backgroundColor: '#eee',
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
    ...mainStyle.circle(130),
    borderWidth: 1,
    borderColor: '#E3E4EE'
  },
  editPicture: {
    ...mainStyle.circle(42),
    backgroundColor: mainStyle.themeColor,

    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    top: 0,
    right: 0,
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
  join: {
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 16,
  },
  joinTxt: {
    ...mainStyle.montText,
    fontSize: 16,
    lineHeight: 23,
    color: '#666',
    textAlign: 'center',
  },
  joinLink: {
    marginTop: 9,
    ...mainStyle.montBold,
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
  },

  nets: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  net: {
    width: 44,
    height: 44,
    marginHorizontal: 20,
  },
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  lang: state.langReducer.lang,
})
const mapDispatchToProps = (dispatch: any) => ({
  updateUser: (info: any) => dispatch(updateUser(info)),
  clearCards: () => dispatch(clearCards()),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

