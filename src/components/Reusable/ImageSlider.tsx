import React from 'react';
import { StyleSheet, Image, FlatList, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Text } from 'react-native';

import AssetImage from './AssetImage'
import VeilView from './VeilView'
import MyText from './MyText'

import Icon from '@expo/vector-icons/AntDesign'

import { mainStyle } from '../../styles'

interface Props {
  pictures: any[];
  base64?: boolean;

  width: number;
  height: number;

  onSelect?: (index: number) => void;
  onRemove?: (index: number) => void;
}
interface State {
  selectedIndex: number;
}
export default class ImageSlider extends React.Component<Props, State>  {
  
  state = {
    selectedIndex: 0,
  }

  onScroll(event: any) {
    const { width } = this.props
    const { selectedIndex } = this.state

    const x = event.nativeEvent.contentOffset.x
    const newIndex = width > 0 ? Math.ceil(x / width) : 0;

    if (newIndex !== selectedIndex) {
      this.setState({
        selectedIndex: newIndex
      })
    }
  }

  renderItem(item: any, index: number) {
    if (!item)
      return (null)
    const { width, height, onSelect } = this.props
    
    const picture = this.props.base64 ? `data:image/gif;base64,${item}` : item
    return (
      <TouchableWithoutFeedback onPress={() => onSelect(index)} disabled={!onSelect} style={{flex: 1}}>
        <View style={[styles.picture, {width: width, height: height}]}>
          <AssetImage style={styles.bgImage} src={{uri: picture}} resizeMode='cover' />
          {/*<VeilView abs start={mainStyle.themeColorAlpha(0.3)} end={mainStyle.themeColorAlpha(0.8)} />*/}
          <MyText style={styles.text}>{item.count}</MyText>
          { this.props.onRemove &&
            <TouchableOpacity style={styles.close} onPress={() => this.props.onRemove(index)}>
              <Icon name="close" size={18} color='#333' />
            </TouchableOpacity>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    const { selectedIndex } = this.state
    const { pictures } = this.props

    const { width, height } = this.props
    return (
      <View style={styles.container}>
        { pictures.length ? (
          <FlatList
            data={pictures}
            pagingEnabled
            onScroll={(event: any) => this.onScroll(event)}
            scrollEventThrottle={16}
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            />
        ) : (
          <View style={[styles.picture, {width: width, height: height}]}>
            <AssetImage src={require('../../images/noimage.png')} resizeMode='cover' />
          </View>
        )}
        <View style={styles.pagination}>
          {pictures.map((item, index) => 
            <View
              key={index}
              style={[
                styles.dot,
                index == selectedIndex ? styles.dotSelected : {}
            ]}></View>
          )}
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picture: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    ...mainStyle.abs,
    flex: 1,
  },
  text: {
    ...mainStyle.montBold,
    fontSize: 42,
    color: '#fff',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dot: {
    ...mainStyle.circle(8),
    marginRight: 2,
    marginLeft: 2,
    borderWidth: 1,
    borderColor: '#fff'
  },
  dotSelected: { 
    backgroundColor: '#fff',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',

    ...mainStyle.circle(36),
  }
});