import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/fr'

import { Fire } from '../../services'
import { AssetImage } from '../Reusable'

import { mainStyle } from '../../styles'

type Props = {
  index: number;
  comment: any;
  canRemove: boolean;

  onRemove: () => void;
}
type State = {

}

export default class CommentItem extends React.Component<Props, State>  {
  
  render() {
    const { comment, index, canRemove, onRemove } = this.props
    const sender = comment.sender

    const date = Fire.getDateFor(comment.createdAt)
    const dateFormatted = moment(date).fromNow()

    return (
      <View style={styles.container}>
        <View style={styles.picture}>
          <AssetImage src={sender.picture ? {uri: sender.picture} : require('../../images/user.png')} resizeMode='cover' />
        </View>
        <View style={styles.row}>
          <Text style={styles.msg}>{comment.message}</Text>
          <Text style={styles.subtitle}>{dateFormatted}</Text>
        </View>
        { canRemove &&
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={onRemove}
            >
            <Icon name="trash" size={22} color='#777' />
          </TouchableOpacity>
        }
      </View>
    );
  }
}

const pictureSize = 40
const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    alignItems: 'center',
  },
  picture: {
    ...mainStyle.circle(pictureSize)
  },
  row: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  msg: {
    fontSize: 14,
    color: mainStyle.darkColor
  },
  subtitle: {
    fontSize: 12,
    color: mainStyle.lightColor
  },
  removeBtn: {
    width: 40,
    height: 40,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
