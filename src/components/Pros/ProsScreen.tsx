import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, Linking, TouchableOpacity, RefreshControl, SectionList, Dimensions } from 'react-native';

import { HeaderBar, AssetImage, FadeInView, VeilView } from '../Reusable'

import ProItem from './ProItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash } from '../../services'

import { fetchHomePros } from '../../actions/pros.action'
import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  pros: any;
  loading: boolean;

  fetchHomePros: () => void;
}
interface State {

}

class ProsScreen extends React.Component<Props, State>  {

  async componentDidMount() {
    
    try {
      await this.registerForPushNotificationsAsync()
    } catch (err) {
      console.log(err)
    }
    //setTimeout(() => Actions.orders(), 500)

    const { pros, fetchHomePros } = this.props
    if (pros)
      return
    try {
      this.reload()
    } catch (err) {
      Flash.error('Veuillez vérifier votre connexion')
    }
   
    //setTimeout(() => Actions.orders(), 200)
    /*setTimeout(() => {
      const pros = this.props.pros.byDate
      if (pros && pros.length > 0)
        Actions.pro({ pro: pros[0]} )
    }, 500)*/

  }

  async registerForPushNotificationsAsync() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted')
      await Permissions.askAsync(Permissions.NOTIFICATIONS);

    await this.savePushToken()
    
  }

  showSettings() {
    Linking.canOpenURL('app-settings:')
      .then(supported => {
        if (!supported) {
          console.warn("Can't handle settings url");
        } else {
          return Linking.openURL('app-settings:');
        }
      })
  }

  async savePushToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      await Fire.set('tokens', this.props.user.id, {
        token: token,
        createdAt: new Date()
      })
    } catch (err) {
      //console.log(err)
    }
  }

  showMore(key: string, title: string) {
    const isShop = key == 'shops'
    Actions.more({ shops: isShop, title, pros: this.props.pros[key] })
  }

  async reload() {
    await this.props.fetchHomePros()   
  }

  renderPro(pro: any, index: number, section: any) {
    return (
      <ProItem
        pro={pro}
        index={index}
        sectioned
        onPress={() => Actions.pro({ pro })}
        />
    )
  }

  render() {
    const { pros, loading, fetchHomePros } = this.props
    const homePros = pros || {}

    return (
      <View style={styles.container}>
        <HeaderBar
          title='All Is Good'
          titleView={
            <AssetImage style={{flex: 1, width: 80, height: 28,}} src={require('../../images/logo.png')} />
          }
          />

        <FadeInView style={styles.container}>
          <SectionList
            ListHeaderComponent={() => (
              <View style={styles.mainHeader}>
                <AssetImage style={styles.headerBackground} src={require('../../images/corner.png')} resizeMode='cover' />
                <VeilView abs start={mainStyle.themeColorAlpha(0.4)} end={mainStyle.themeColor} startPos={{x: 0, y: 0}} endPos={{x: 1, y: 0.8}} />
                <MyText style={styles.mainHeaderTxt}>Faites vous plaisir{'\n'}en économisant !</MyText>
              </View>
            )}
            contentContainerStyle={{paddingBottom: 20}}
            stickySectionHeadersEnabled={false}
            renderItem={({item, index, section}) => this.renderPro(item, index, section)}
            renderSectionHeader={({section}) => (
              <TouchableOpacity onPress={() => this.showMore(section.key, section.subtitle)}>
                <MyText style={styles.headerTxt}>{section.title}</MyText>
              </TouchableOpacity>
            )}
            sections={[
              {key: 'byDate', subtitle: 'Nouveautés', title: 'Nouveautés'.toUpperCase(), data: homePros.byDate || []},
              {key: 'byPopularity', subtitle: 'Populaires', title: 'Populaires'.toUpperCase(), data: homePros.byPopularity || []},
            ]}
            keyExtractor={(item, index) => item + index}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => this.reload()}
              />
            }
          />
        </FadeInView>
      </View>
    );
  }

  renderEmpty() {
    const { loading } = this.props
    return (
      <View style={styles.empty}>
        <MyText>{ loading ? 'Chargement en cours... ' : 'Aucun produit'}</MyText>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeader: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    paddingHorizontal: 20,
    textAlign: 'center',
    lineHeight: 40,
  },
  header: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 140,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  headerTxt: {
    color: mainStyle.darkColor,
    fontWeight: 'bold',
    fontSize: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    lineHeight: 36,
  },
  headerBackground: {
    ...mainStyle.abs,
    flex: 1,
  }
});


const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
  pros: state.prosReducer.homePros,
  loading: state.prosReducer.loading,
})
const mapDispatchToProps = (dispatch: any) => ({
  fetchHomePros: () => dispatch(fetchHomePros())
})
export default connect(mapStateToProps, mapDispatchToProps)(ProsScreen)
