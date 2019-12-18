import React from 'react';
import { connect } from 'react-redux'

import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import EvilIcon from '@expo/vector-icons/EvilIcons'
import AntDesign from '@expo/vector-icons/AntDesign'

import Constants from 'expo-constants';

import NotifBubble from './NotifBubble'
import VeilView from './VeilView'

import { mainStyle } from '../../styles'

interface Props {
  user: any;
  title?: string;
  titleView?: any;
  rightView?: any;
  barView?: any;
  back?: boolean;
  close?: boolean;
  main?: boolean;
  backAction?: () => void;
}

const HeaderBar: React.SFC<Props> = (props) => {
  const { title, back, close, backAction } = props
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      { props.barView ? (props.barView) : (
        <View style={styles.content}>
          {/* Center */}
          <View style={styles.center}>
            { props.title ? (
              <Text style={styles.title}>{(title || '').toUpperCase()}</Text>
            ) : props.titleView}
          </View>

          {/* Left */}
          <View>
            { props.back ? (
              <TouchableOpacity style={styles.leftBtn} onPress={backAction || Actions.pop}>
                <AntDesign name="left" size={16} color='#fff' />
              </TouchableOpacity>
            ) : props.close ? (
              <TouchableOpacity style={styles.leftBtn} onPress={backAction || Actions.pop}>
                <EvilIcon name="close" size={24} color='#fff' />
              </TouchableOpacity>
            ) : props.main ? (
              <TouchableOpacity style={styles.leftBtn} onPress={Actions.profile}>
                <FontAwesome name="user" size={23} color='#fff' />
              </TouchableOpacity>
            ) : (null)}
          </View>

          {/* Right */}
          <View style={styles.right}>
            { props.rightView ? props.rightView : (null)}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...ifIphoneX({
      height: 100,
      paddingTop: 40,
    }, {
      height: 50 + Constants.statusBarHeight,
      paddingTop: Constants.statusBarHeight,
    }),

    backgroundColor: mainStyle.themeColor
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  center: {
    ...mainStyle.abs,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...mainStyle.montBold,
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
  leftBtn: {
    padding: 12,
    paddingRight: 25,
    paddingLeft: 16,

    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    paddingRight: 16,
  }
});

const mapStateToProps = (state: any) => ({
  user: state.authReducer.user,
})

export default connect(mapStateToProps)(HeaderBar)
