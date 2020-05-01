import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage, MyText } from '../Reusable'
import { Fire, Flash } from '../../services'

import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'
import { switchTab } from '../../actions/tab.action'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { mainStyle } from '../../styles'

interface Props {
  index: number;
  pro: any;
  wishes: any;

  switchTab: (tab: number) => void;
  addWish: (pro: any) => void;
  removeWish: (pro: any) => void;
  onPress: () => void;
  isInWishes: (pro: any) => boolean;
}
const WishItem: React.FC<Props> = (props: Props) => {
  
  const toggleWish = () => {
    const { addWish, removeWish, pro, isInWishes } = props
    const onPress = () => {
      props.switchTab(3)
      Actions.reset('root')
    }

    if (isInWishes(pro)) {
      removeWish(pro)
      Flash.show('Supprimé des favoris !')
    } else {
      addWish(pro)
      Flash.show('Ajouté aux favoris !', 'Cliquez pour voir vos favoris', onPress)
    }
  }

  const { pro, index, onPress, isInWishes } = props
  const inWishes = isInWishes(pro)
  const name = pro.name && pro.name.length > 22 ? (pro.name.substr(0, 18) + '...') : pro.name
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={pro.pictures ? {uri: pro.pictures[0]} : require('../../images/user.png')} resizeMode='cover' />
            </View>

            <View style={styles.info}>
              <MyText numberOfLines={1} style={styles.name}>{name}</MyText>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <MaterialIcon size={18} name="map-marker" />  
                </View>
                <MyText style={[styles.open]}>4 km</MyText>               
              </View>
            </View>


            <View style={styles.logoWrapper}>
              <View style={styles.logo}>
                <AssetImage src={pro.logo ? {uri: pro.logo} : require('../../images/user.png')} resizeMode='cover' />
              </View>
            </View>

            <TouchableOpacity
              style={styles.wishBtn}
              onPress={() => toggleWish()}>
              { inWishes ? (
                <AssetImage src={require('../../images/like.png')} />
              ) : (
                <AssetImage src={require('../../images/like_empty.png')} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const margin = 20
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  shadow: {
    width: Dimensions.get('window').width - margin * 2,
    marginTop: 18,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picture: {
    height: 110,
  },
  logoWrapper: {
    position: 'absolute',
    top: 95,
    left: 12,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(42),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  info: {
    padding: 10,
    backgroundColor: '#fff',
  },
  name: {
    ...mainStyle.montBold,
    fontSize: 16,
    marginLeft: 60,
    color: mainStyle.darkColor
  },
  open: {
    ...mainStyle.montText,
    fontSize: 13,
    color: mainStyle.darkColor,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },

  wishBtn: {
    ...mainStyle.abs,
    bottom: undefined, left: undefined,
    top: 4, right: 4,
    width: 28,
    height: 28,
    padding: 3,
  },
});

const mapStateToProps = (state: any) => ({
  wishes: state.wishesReducer.list,
  wishesToggle: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (pro: any) => dispatch(addWish(pro)),
  removeWish: (pro: any) => dispatch(removeWish(pro)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInWishes: (pro: any) => dispatch(isInWishes(pro)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WishItem)