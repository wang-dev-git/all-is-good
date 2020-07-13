import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Keyboard, Platform, Text, RefreshControl, ScrollView, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, MyText, ListEmpty, SmallButton, FadeInView, BottomButton, AssetImage, VeilView } from '../Reusable'
import { Fire, Modal, Maps, Tools } from '../../services'

import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Icon from '@expo/vector-icons/FontAwesome'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo'

import ProItem from '../Pro/ProItem'
import CategoryItem from './CategoryItem'
import FiltersModal from './FiltersModal'
import BackSearchBar from './BackSearchBar'

import { mainStyle } from '../../styles'

import { loadSearchable, loadCategories } from '../../actions/filters.action'
import { updatePosition } from '../../actions/auth.action'

interface Props {}
const SearchScreen: React.FC<Props> = (props) => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [animating, setAnimating] = React.useState(false)

  const user = useSelector(state => state.authReducer.user)
  const lang = useSelector(state => state.langReducer.lang)
  const langId = useSelector(state => state.langReducer.id)
  const searchable = useSelector(state => state.filtersReducer.searchable)
  const categories = useSelector(state => state.filtersReducer.categories)
  const position = useSelector(state => state.authReducer.position)
  const loadingCategories = useSelector(state => state.filtersReducer.loadingCategories)
  const dispatch = useDispatch()

  const savePushToken = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status === 'granted') {
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        await Fire.store().collection('tokens').doc(user.id).set({
          token: token,
          createdAt: new Date()
        })
      } catch (err) {
        //Flash.error(err)
      }
    } 
  }

  const askGeoloc = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      const addr = await Maps.getAddress(location.coords.latitude, location.coords.longitude)
      if (addr.length) {
        dispatch(updatePosition(addr[0]))
      }
    }

    savePushToken()
  }

  React.useEffect(() => {
    if (!position)
      askGeoloc()
    else
      savePushToken()
  }, [position])

  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      content: () => <FiltersModal />,
    })
  }

  const showAddresses = () => {
    Actions.addresses({
      title: lang.ADDRESSES_TITLE,
      onSelect: (pos) => {
        dispatch(updatePosition(pos))
      }
    })
  }

  const refresh = () => {
    dispatch(loadCategories())
    dispatch(loadSearchable())
  }

  const filtered = searchable.filter((item) => {
    for (const cat of (item.categories || [])) {
      for (const langId in (cat.names || {})) {
        const name = cat.names[langId]
        if (name.toLowerCase().includes(query.toLowerCase()))
          return true
      }
    }
    return false
  })

  return (
    <View style={styles.container}>
      <HeaderBar
        logo
        />
      <BackSearchBar
        query={query}
        onChange={setQuery}
        onFilters={showFilters}
        onClear={() => setQuery('')}
        />
      <FadeInView style={styles.content}>
        { !position ? (
          <ScrollView contentContainerStyle={{paddingBottom: 20}}>
            <ListEmpty
              text={lang.HOME_NO_POS_TITLE}
              subtext={lang.HOME_NO_POS_MESSAGE}
              wrapperStyle={{marginTop: 40}}
              imageSize={120}
              image={require('../../images/nocategories.png')}
              btnTxt={lang.HOME_NO_POS_BTN}
              onPressBtn={showAddresses}
              />
          </ScrollView>
        ) : query !== '' ? (
          <FlatList
            key="A"
            data={filtered.filter(item => item.quantity !== undefined).sort((a, b) => {
              if (a.quantity < b.quantity) return 1
              else if (a.quantity > b.quantity) return -1
              return 0
            })}
            refreshControl={
              <RefreshControl
                tintColor='#fff'
                refreshing={loading}
                onRefresh={refresh}
              />
            }
            contentContainerStyle={{paddingBottom: 20, paddingTop: 50,}}
            renderItem={({ item }) =>
              <ProItem
                pro={item}
                onPress={() => Actions.pro({ pro: item })}
                />
            }
            ListEmptyComponent={() => (
              <ListEmpty
                text={loading ? lang.GLOBAL_LOADING : lang.GLOBAL_NO_RESULT}
                image={require('../../images/noresult.png')}
                btnTxt={lang.HOME_SEARCH_AGAIN}
                onPressBtn={() => setQuery('')}
                />
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        ) : loadingCategories ? (
          <MyText style={{marginTop: 60, textAlign: 'center', color: '#fff'}}>{lang.GLOBAL_LOADING}</MyText>
        ) : (
          <FlatList
            key="B"
            scrollEnabled={Platform.OS === 'ios' || !animating}
            extraData={{ filtered: filtered }}
            data={categories.filter(item => {
              for (const pro of filtered) {
                for (const cat of pro.categories) {
                  if (cat.id === item.id)
                    return true
                }
              }
              return false
            })}
            refreshControl={Platform.OS === 'android' && animating ? (null) : 
              <RefreshControl
                tintColor='#fff'
                refreshing={loading}
                onRefresh={refresh}
              />
            }
            numColumns={2}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 50 }}
            renderItem={(item: any) => 
              <CategoryItem
                onAnimating={setAnimating}
                index={item.index}
                category={item.item}
                onPress={() => setQuery(Tools.getLang(item.item.names, langId))}
                />
            }
            ListEmptyComponent={() => (
              <ListEmpty
                text={lang.HOME_EMPTY_TITLE}
                subtext={lang.HOME_EMPTY_MESSAGE}
                wrapperStyle={{marginTop: 0}}
                imageSize={120}
                image={require('../../images/nocategories.png')}
                btnTxt={lang.HOME_EMPTY_BTN}
                onPressBtn={showFilters}
                />
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        )}
      </FadeInView>
    </View>
  )
}

const searchBarHeight = 40
const searchBarMargin = 20
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainStyle.themeColor,
  },
  content: {
    flex: 1,
  },
});

export default SearchScreen