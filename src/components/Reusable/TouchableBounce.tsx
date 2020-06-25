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
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 })

  const onStart = (e) => {

    const x = e.nativeEvent.locationY
    const y = e.nativeEvent.locationX
    setStartPos({ x, y })

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

    const dist1 = Math.abs(x - startPos.x)
    const dist2 = Math.abs(y - startPos.y)

    const dist = Math.max(dist1, dist2)

    Animated.timing(bounce, {
      toValue: 1,
      duration: 200,
    }).start(() => {

      if (x > 0 && x < props.width &&
        y > 0 && y < props.height) {
        if (dist < 10)
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