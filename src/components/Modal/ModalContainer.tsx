import React from 'react';
import { connect, useDispatch } from 'react-redux'

import { StyleSheet, Animated, View, Text, TouchableOpacity, TouchableWithoutFeedback, Platform, StatusBar } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'
import { mainStyle } from '../../styles'

import { Modal } from '../../services'

interface Props {
  shown: boolean;
  onClose?: () => void;
  component: any;
}

const ModalContainer: React.SFC<Props> = (props) => {

  const close = () => {
    Modal.hide()
    if (props.onClose)
      props.onClose()
  }

  const animate = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    console.log(props.shown)
    Animated.timing(animate, {
      toValue: props.shown ? 1 : 0,
      duration: 1200
    }).start();
  }, [props.shown]);

  const slide = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [220, 0]
  })

  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={() => close()}>
        <Animated.View style={[styles.container, {opacity: animate}]}>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.content, {transform: [{translateY: slide}]}]}>
        {props.component}
      </Animated.View>
    </React.Fragment>
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

    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    height: 220,
    backgroundColor: 'blue',

    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  }
});

const mapStateToProps = (state: any) => ({
  shown: state.modalReducer.shown,
  onClose: state.modalReducer.onClose,
  component: state.modalReducer.component,
})

export default connect(mapStateToProps)(ModalContainer)
