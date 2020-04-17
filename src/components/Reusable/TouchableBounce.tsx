import React from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';

interface Props {
  width: number;
  height: number;
  style: any;
  onPress: () => void;
}

const TouchableBounce: React.FC<Props> = (props) => {
  const bounce = React.useRef(new Animated.Value(1)).current

  const onStart = (e) => {
    Animated.timing(bounce, {
      toValue: 1.124,
      duration: 420,
    }).start(() => {

    })
  }
  const onMove = (e) => {
  }
  const onEnd = (e) => {
    
    const x = e.nativeEvent.locationY
    const y = e.nativeEvent.locationX

    Animated.timing(bounce, {
      toValue: 1,
      duration: 200,
    }).start(() => {

      if (x > 0 && x < props.width &&
        y > 0 && y < props.height) {
        props.onPress()
      }
    })
   }

  return (
    <Animated.View
      style={[props.style, {transform: [{scale: bounce}]}]}
      onTouchStart={onStart}
      onTouchMove={onMove}
      onTouchEnd={onEnd}
      >
      {props.children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  
});

export default TouchableBounce