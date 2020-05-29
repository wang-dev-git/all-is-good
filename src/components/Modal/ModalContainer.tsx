import React from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { StyleSheet, Animated, View, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback, Platform, StatusBar } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import { mainStyle } from '../../styles'

import { Modal } from '../../services'

interface ModalProps {
  local: boolean;

  name: string;
  shown: boolean;
  onClose?: () => void;
  onTerminate?: () => void;
  content: any;
}
const ModalInstance: React.FC<ModalProps> = (props) => {

  const close = () => {
    Modal.hide(props.name)
    if (props.onClose)
      props.onClose()
  }

  const opacity = React.useRef(new Animated.Value(0)).current;
  const slide = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(opacity, {
      toValue: props.shown ? 1 : 0,
      velocity: 3,
      tension: 2,
      friction: 8,
    }).start(() => {
      if (!props.shown) {
        if (props.onTerminate)
          props.onTerminate()
        else
          Modal.terminate(props.name)
      }
    });
    
  }, [props.shown]);

  const height = Dimensions.get('window').height
  const translateY = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0]
  })

  return (
    <View style={styles.container} pointerEvents={props.shown ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={() => close()}>
        <Animated.View style={[styles.veil, {opacity: opacity}]}></Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.content, {opacity: opacity, transform: [{translateY: translateY}]}]}>
        {props.content !== undefined ? props.content() : null}
      </Animated.View>
    </View>
  )
}

interface Props {
  id: string;
}
const ModalContainer: React.FC<Props> = (props) => {
  const modals = useSelector(state => state.modalReducer.modals)
  const toggle = useSelector(state => state.modalReducer.toggle)
  const modal = modals[props.id]
  if (!modal) return (null)
  return (
    <ModalInstance
      name={modal.key}
      shown={modal.shown}
      content={modal.content}
      onClose={modal.onClose}
      onTerminate={modal.onTerminate}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  veil: {
    flex: 1,
    height: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: -22,
    paddingBottom: 22,
    backgroundColor: '#fff',

    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default (ModalContainer)
