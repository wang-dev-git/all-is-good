import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, Text, View, FlatList, TouchableOpacity, Linking, Alert, Platform, ScrollView, Dimensions } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import ImageBrowser from 'expo-multiple-media-imagepicker/src/ImageBrowser'
import Icon from '@expo/vector-icons/AntDesign'

import { HeaderBar } from '../Reusable'
import useCameraRoll from './PickerHook';

import { mainStyle } from '../../styles'

interface Props {
  callback: (res: any) => void;
}
interface State {
}

const columns = 4
const headerSize = ifIphoneX({ height: 100 }, {height: 70}).height

const renderItem = ({item, selected, setSelected}) => {

  const isSelected = selected.includes(item)
  const onSelect = () => {
    setSelected((selected) => {
      let isFavorite = selected.includes(item);
      if (isFavorite) {
        return selected.filter((e) => e.uri !== item.uri);
      }
      return [...selected, item];
    })
  }
  return (
    <TouchableOpacity onPress={onSelect}>
      <Image
        style={{width: Dimensions.get('window').width / columns, height: Dimensions.get('window').width / columns}}
        source={item}
        />
      <View style={[styles.badge, isSelected ? styles.badgeSelected : {}]}>
        {isSelected && <Icon name="check" size={10} color='green' />}
      </View>
    </TouchableOpacity>
  )
}

const ImagePickerScreen = ({ callback }) => {

  const [photos, getPhotos] = useCameraRoll({ first: 80 });
  const [selected, setSelected] = React.useState([])
  const renderItemCall = React.useCallback(({ item, index }) => renderItem({ item, index, selected, setSelected }));
  
  if (photos.length === 0)
    getPhotos()
  return (
    <View>
      <HeaderBar
        title='Sélectionner'
        rightView={
          <TouchableOpacity onPress={() => callback(selected)}>
            <Text style={styles.chooseTxt}>Choisir</Text>
          </TouchableOpacity>
        }
        back
        />
      <FlatList
        extraData={selected}
        style={{height: Dimensions.get('window').height - headerSize}}
        data={photos}
        
        renderItem={renderItemCall}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={getPhotos}
        onEndReachedThreshold={0.4}
        numColumns={columns}
        />
    </View>
  )

  return (
    null/*
    <ImageBrowser
      max={5}
      headerCloseText={'Annuler'}
      headerDoneText={'Terminé'}
      headerButtonColor={'#E31676'}
      headerSelectText={'sélectionnés'}
      badgeColor={'#E31676'}
      emptyText={'Aucune image'}

      callback={(res) => this.props.callback(res)}
      />*/
  );
}

const badgeSize = 22
const styles = StyleSheet.create({
  chooseTxt: {

  },
  badge: {
    width: badgeSize,
    height: badgeSize,
    borderRadius: badgeSize / 2,
    backgroundColor: 'transparent',
    overflow: 'hidden',

    position: 'absolute',
    right: 10,
    top: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSelected: {
    backgroundColor: '#fff',
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(ImagePickerScreen)
