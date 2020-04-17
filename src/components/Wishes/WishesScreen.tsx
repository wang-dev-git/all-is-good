import React from 'react';
import { connect, useSelector } from 'react-redux';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

import { HeaderBar, FadeInView } from '../Reusable'

import ProItem from '../Pros/ProItem'

import { Actions } from 'react-native-router-flux'
import { Fire } from '../../services'

import { addWish, removeWish, clearWishes } from '../../actions/wishes.action'

type Props = {
  wishes: any;

  clearWishes: () => void;
  removeWish: (pro: any) => void;
}
type State = {

}

const WishesScreen: React.FC<Props> = (props) => {

  const lang = useSelector(state => state.langReducer.lang)
  const { wishes, removeWish } = props

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
            <View style={styles.empty}>
              <Text>{lang.FAVORITE_NONE}</Text>
            </View>
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
  },
  empty: {
    flex: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


const mapStateToProps = (state: any) => ({
  wishes: state.wishesReducer.list,
  toggle: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (pro: any) => dispatch(addWish(pro)),
  removeWish: (pro: any) => dispatch(removeWish(pro)),
  clearWishes: () => dispatch(clearWishes()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WishesScreen)
