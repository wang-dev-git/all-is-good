import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, Linking, TouchableOpacity, RefreshControl, SectionList, Dimensions } from 'react-native';

import { HeaderBar, AssetImage, FadeInView, VeilView } from '../Reusable'

import ProductItem from './ProductItem'
import ShopItem from './ShopItem'

import { Actions } from 'react-native-router-flux'
import { Fire, Flash } from '../../services'

import { fetchHomeProducts } from '../../actions/products.action'
import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  products: any;
  loading: boolean;

  fetchHomeProducts: () => void;
}
interface State {

}

class ProductsScreen extends React.Component<Props, State>  {

  async componentDidMount() {
    
    try {
      await this.registerForPushNotificationsAsync()
    } catch (err) {
      console.log(err)
    }
    //setTimeout(() => Actions.orders(), 500)

    const { products, fetchHomeProducts } = this.props
    if (products)
      return
    try {
      this.reload()
    } catch (err) {
      Flash.error('Veuillez vérifier votre connexion')
    }
   
    setTimeout(() => {
      const products = this.props.products.byDate
      if (products && products.length > 0)
        Actions.product({ product: products[0]} )
    }, 500)

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
    Actions.more({ shops: isShop, title, products: this.props.products[key] })
  }

  async reload() {
    await this.props.fetchHomeProducts()   
  }

  renderProduct(product: any, index: number, section: any) {
    return (
      <ProductItem
        product={product}
        index={index}
        sectioned
        onPress={() => Actions.product({ product })}
        />
    )
  }

  renderShop(shop: any) {
    return (
      <ShopItem
        shop={shop}
        onPress={() => Actions.shop({ shop })}
        />
    )
  }

  render() {
    const { products, loading, fetchHomeProducts } = this.props
    const homeProducts = products || {}

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
                <AssetImage style={styles.headerBackground} src={require('../../images/cooker.png')} resizeMode='cover' />
                <VeilView abs start={mainStyle.themeColorAlpha(0.4)} end={mainStyle.themeColor} startPos={{x: 0, y: 0}} endPos={{x: 1, y: 0.8}} />
                <Text style={styles.mainHeaderTxt}>Faites vous plaisir{'\n'}en économisant !</Text>
              </View>
            )}
            contentContainerStyle={{paddingBottom: 20}}
            stickySectionHeadersEnabled={false}
            renderItem={({item, index, section}) => this.renderProduct(item, index, section)}
            renderSectionHeader={({section}) => (
              <TouchableOpacity onPress={() => this.showMore(section.key, section.subtitle)}>
                <Text style={styles.headerTxt}>{section.title}</Text>
              </TouchableOpacity>
            )}
            sections={[
              {key: 'byDate', subtitle: 'Nouveautés', title: 'Nouveautés'.toUpperCase(), data: homeProducts.byDate || []},
              {key: 'byPopularity', subtitle: 'Populaires', title: 'Populaires'.toUpperCase(), data: homeProducts.byPopularity || []},
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
        <Text>{ loading ? 'Chargement en cours... ' : 'Aucun produit'}</Text>
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
  products: state.productsReducer.homeProducts,
  loading: state.productsReducer.loading,
})
const mapDispatchToProps = (dispatch: any) => ({
  fetchHomeProducts: () => dispatch(fetchHomeProducts())
})
export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen)
