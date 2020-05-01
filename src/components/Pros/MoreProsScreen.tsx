import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, RefreshControl, SectionList, Dimensions } from 'react-native';

import { HeaderBar, MyText , AssetImage, FadeInView, VeilView } from '../Reusable'

import ProItem from './ProItem'

import { Actions } from 'react-native-router-flux'
import { Fire } from '../../services'

import { mainStyle } from '../../styles'

interface Props {
  pros: any;
  title: string;
  shops: boolean;

  loading: boolean;
}
interface State {}

class MoreProsScreen extends React.Component<Props, State>  {
  
  renderPro(pro: any, index: number) {
    return (
      <ProItem
        pro={pro}
        index={index}
        onPress={() => Actions.pro({ pro })}
        />
    )
  }

  loadMore() {

  }

  render() {
    const { title, pros, loading } = this.props
    return (
      <View style={styles.container}>
        <HeaderBar
          title={title}
          back
          />

        <FadeInView style={styles.container}>
          <FlatList
            renderItem={({item, index}) => this.renderPro(item, index)}
            data={pros}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => this.loadMore()}
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
});


const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(MoreProsScreen)
