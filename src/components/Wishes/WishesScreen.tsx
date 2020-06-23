import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

import { HeaderBar, FadeInView, AssetImage, MyText, ListEmpty } from '../Reusable'

import ProItem from '../Pro/ProItem'

import { Actions } from 'react-native-router-flux'
import { Fire } from '../../services'

import { switchTab } from '../../actions/tab.action'

import { mainStyle } from '../../styles'

type Props = {
  wishes: any;
}
const WishesScreen: React.FC<Props> = (props) => {

  const lang = useSelector(state => state.langReducer.lang)
  const wishes = useSelector(state => state.wishesReducer.list)
  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <HeaderBar
        logo
        />

      <FadeInView style={styles.container}>
        <FlatList
          data={wishes || []}
          renderItem={({ item }) =>
            <ProItem
              isWish
              pro={item}
              onPress={() => Actions.pro({ pro: item })}
              />
          }
          ListEmptyComponent={() => (
            <ListEmpty
              text={lang.FAVORITE_NONE}
              image={require('../../images/nofavorite.png')}
              wrapperStyle={{marginTop: 40}}
              btnTxt={lang.FAVORITE_DISCOVER}
              onPressBtn={() => dispatch(switchTab(0))}
              />
          )}
          keyExtractor={(item, index) => index.toString()}
          />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainStyle.themeColor,
  },
});

export default WishesScreen