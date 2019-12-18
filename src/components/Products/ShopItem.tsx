import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage } from '../Reusable'
import { Fire, Flash } from '../../services'

import { switchTab } from '../../actions/tab.action'

import { mainStyle } from '../../styles'

interface Props {
  index: number;
  shop: any;

  onPress: () => void;
  switchTab: (tab: number) => void;
}
const ShopItem: React.FC<Props> = (props: Props) => {
  const { shop, index, onPress } = props
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <AssetImage style={{opacity: 0.7}} src={shop.background ? {uri: shop.background} : require('../../images/shop-bg.png')} resizeMode='cover' />
        <View style={styles.logo}>
          <View style={styles.logoImg}>
            <AssetImage src={shop.picture ? {uri: shop.picture} : require('../../images/user.png')} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const logoSize = 90
const shopHeight = 150
const spaceBetween = 20
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width - 20,
    marginHorizontal: 10,
    marginVertical: 12,
    height: shopHeight,
  },
  logo: {
    ...mainStyle.abs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    ...mainStyle.circle(logoSize),
  },
  name: {
    color: '#333',
  }
});

const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({
  switchTab: (tab: number) => dispatch(switchTab(tab)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopItem)