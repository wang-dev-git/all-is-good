import React from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';

interface Props {
  width: number;
  height: number;
  style: any;

  onPress: () => void;
  onAnimating: (animating: boolean) => void;
}

const TouchableBounce: React.FC<Props> = (props) => {
  const bounce = React.useRef(new Animated.Value(1)).current
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 })

  const onStart = (e) => {

    const x = e.nativeEvent.locationX
    const y = e.nativeEvent.locationY
    setStartPos({ x, y })

    props.onAnimating(true)
    Animated.timing(bounce, {
      toValue: 1.124,
      duration: 210,
    }).start(() => {

    })
  }
  const onMove = (e) => {
  }
  const onEnd = (e) => {

    props.onAnimating(false)
    
    const x = e.nativeEvent.locationX
    const y = e.nativeEvent.locationY

    const dist1 = Math.abs(x - startPos.x)
    const dist2 = Math.abs(y - startPos.y)

    const dist = Math.max(dist1, dist2)
    //alert("X: " + x + "\nY: " + y + "\nDist: " + dist)

    Animated.timing(bounce, {
      toValue: 1,
      duration: 200,
    }).start(() => {
      const padding = 10
      if (x > padding && x < (props.width - padding) &&
        y > padding && y < (props.height - padding)) {
        if (dist < 12)
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