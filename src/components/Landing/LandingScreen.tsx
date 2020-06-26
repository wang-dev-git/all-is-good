import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, Linking, StatusBar, Dimensions } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import Icon from '@expo/vector-icons/FontAwesome';
import { AssetImage, VeilView, MyText } from '../Reusable'
import { Fire, Facebook, Google, Flash } from '../../services'
import { Actions } from 'react-native-router-flux'
import { saveName } from '../../actions/auth.action'

import { mainStyle } from '../../styles'

interface Props {
  lang: any;
  saveName: (name: any) => void;
}
interface State {
  editing: boolean;
}
class LandingScreen extends React.Component<Props, State>  {
  
  state = {
    editing: false
  }

  login() {
    Actions.login()
  }

  async googleLogin() {
    this.setState({ editing: true })
    try {
      await Google.init()
      const res = await Google.login()
      const user = res.user
      const pictureURL = null
      this.props.saveName({ facebook: true, pictureURL: pictureURL, first_name: user.firstName, last_name: user.lastName, email: user.email })
      await Fire.signInGoogle(res.token)
    } catch (err) {
      alert(err.message)
      //Flash.error(this.props.lang.GLOBAL_LOADING_ERROR)
    }
    this.setState({ editing: false })
  }

  async facebookLogin() {
    this.setState({ editing: true })
    try {
      const res = await Facebook.login()
      const user = res.user
      const pictureURL = user.picture && user.picture.data ? user.picture.data.url : null
      this.props.saveName({ facebook: true, pictureURL: pictureURL, first_name: user.first_name, last_name: user.last_name, email: user.email })
      await Fire.signInFacebook(res.token)
    } catch (err) {
      Flash.error(this.props.lang.GLOBAL_LOADING_ERROR)
    }
    this.setState({ editing: false })
  }

  componentDidMount() {
    //setTimeout(() => Actions.login(), 200)
  }

  openConditions() {
    Linking.openURL('https://allisgood-app.com/terms')
  }

  render() {
    const { lang } = this.props
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        {/*<AssetImage style={styles.background} src={require('../../images/bg-landing.jpg')} resizeMode='cover' />*/}
        {/*<VeilView abs start={'rgba(0, 165, 235, 0.34)'} end={'rgba(220, 2, 250, 0.34)'} />*/}

        {/*}
        <View style={styles.logoWrapper}>
          <View style={styles.logo}>
            <AssetImage src={require('../../images/logo.png')} resizeMode='contain' />
          </View>
        </View>*/}

        <View style={styles.top}>
          <MyText style={styles.introTxt}>{lang.LANDING_INTRO}</MyText>

          <View style={styles.introImg}>
            <AssetImage src={require('../../images/baigy.png')} resizeMode='contain' />
          </View>
        </View>

        <View style={styles.floatingBottom}>

          <View style={styles.btns}>

            <TouchableOpacity disabled={this.state.editing} onPress={() => this.login()}>
              <View style={[styles.btn, {backgroundColor: mainStyle.themeColor}]}>
                <MyText style={styles.txt}>{lang.LANDING_CONNECT_EMAIL}</MyText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity disabled={this.state.editing} style={{marginTop: 6}} onPress={() => this.facebookLogin()}>
              <View style={[styles.btn, {backgroundColor: '#3C5A99'}]}>
                <View style={styles.floating}>
                  <Icon name='facebook' color={'#fff'} size={22} />  
                </View>
                <MyText style={[styles.txt, {marginLeft: 20, color: '#fff'}]}>{lang.LANDING_CONNECT_FB}</MyText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity disabled={this.state.editing} style={{marginTop: 6}}  onPress={() => this.googleLogin()}>
              <View style={[styles.btn, {backgroundColor: '#fff', borderColor: '#d93025', borderWidth: 1}]}>
                <View style={styles.floating}>
                  <AssetImage src={require('../../images/google.png')} resizeMode='contain' style={{width: 20}}/>
                </View>
                <MyText style={[styles.txt, {marginLeft: 20, color: '#222'}]}>{lang.LANDING_CONNECT_GOOGLE}</MyText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.openConditions()}>
              <MyText style={styles.cgu}>{lang.LANDING_CONDITIONS}</MyText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const margin = 42
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
  },
  top: {
    flex: 1,

    paddingTop: 40,
    ...ifIphoneX({
      marginBottom: 300,
    }, {
      marginBottom: 240,
    }),

    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  logoWrapper: {
    ...ifIphoneX({
      marginTop: 100,
    }, {
      marginTop: 26,
    }),
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 100,
  },

  introTxt: {
    ...mainStyle.montBold,
    fontSize: 24,
    paddingHorizontal: 30,
    textAlign: 'center',
    color: mainStyle.themeColor
  },

  introImg: {
    width: Dimensions.get('window').width * 0.64,
    height: Dimensions.get('window').width * 0.64,
  },

  floatingBottom: {
    position: 'absolute', left: 0, right: 0,
    ...ifIphoneX({
      bottom: 64
    }, {
      bottom: 14
    }),

    alignItems: 'center',
  },

  btns: {
    alignItems: 'center'
  },

  btn: {
    width: Dimensions.get('window').width - (margin * 2),
    height: 44,
    borderRadius: 44 / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  txt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  floating: {
    position: 'absolute', top: 0, bottom: 0, left: 30,
    justifyContent: 'center',
  },
  cgu: {
    marginTop: 12,
    paddingHorizontal: 25,
    lineHeight: 20,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  }
});


const mapStateToProps = (state: any) => ({
  lang: state.langReducer.lang,
})
const mapDispatchToProps = (dispatch: any) => ({
  saveName: (name: any) => dispatch(saveName(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen)
