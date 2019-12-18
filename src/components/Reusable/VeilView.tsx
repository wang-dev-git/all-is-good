import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  abs?: boolean;
  wrapperStyle?: any;
  children?: any;
  inversed?: boolean;

  start?: string;
  end?: string;
  startPos?: any;
  endPos?: any;
}

const defaultProps: Props = {
  abs: false,
}

const VeilView: React.SFC<Props> = (props) => (
  <LinearGradient
    pointerEvents={'none'}
    style={[
      props.abs ? {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0} : {},
      props.wrapperStyle
    ]}
    start={props.startPos}
    end={props.endPos}
    colors={[props.start || 'black', props.end || 'black']}>
    { props.children }
  </LinearGradient>
)


const styles = StyleSheet.create({
  
});

VeilView.defaultProps = defaultProps
export default VeilView;